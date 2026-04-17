require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function criarAssentosPadrao(passagem) {
  return [
    { trip_id: passagem.id, seat_number: '1A', class: 'Econômica', available: true },
    { trip_id: passagem.id, seat_number: '1B', class: 'Econômica', available: true },
    { trip_id: passagem.id, seat_number: '2A', class: 'Econômica', available: true },
    { trip_id: passagem.id, seat_number: '2B', class: 'Econômica', available: false },
    { trip_id: passagem.id, seat_number: '3A', class: 'Executiva', available: true },
    { trip_id: passagem.id, seat_number: '3B', class: 'Executiva', available: true },
    { trip_id: passagem.id, seat_number: '4A', class: 'Primeira Classe', available: true },
  ];
}

async function criarCabinesPadrao(passagem) {
  return [
    { trip_id: passagem.id, cabin_number: '101', cabin_type: 'Interna', capacity: 2, available: true },
    { trip_id: passagem.id, cabin_number: '102', cabin_type: 'Interna', capacity: 2, available: true },
    { trip_id: passagem.id, cabin_number: '103', cabin_type: 'Interna', capacity: 4, available: false },
    { trip_id: passagem.id, cabin_number: '201', cabin_type: 'Externa', capacity: 2, available: true },
    { trip_id: passagem.id, cabin_number: '202', cabin_type: 'Externa', capacity: 2, available: true },
    { trip_id: passagem.id, cabin_number: '301', cabin_type: 'Suite', capacity: 2, available: true },
  ];
}

async function processarAssentos(passagensAereas) {
  let assentosAdicionados = 0;
  
  for (const passagem of passagensAereas) {
    const { data: assentosExistentes } = await supabase
      .from('trip_seats')
      .select('id')
      .eq('trip_id', passagem.id);

    if (!assentosExistentes || assentosExistentes.length === 0) {
      console.log(`⚠️  Passagem aérea ${passagem.id} (${passagem.origin} → ${passagem.destination}) sem assentos`);
      
      const assentosParaCriar = await criarAssentosPadrao(passagem);
      const { error: errorInsert } = await supabase
        .from('trip_seats')
        .insert(assentosParaCriar);

      if (errorInsert) {
        console.error(`   ❌ Erro ao criar assentos: ${errorInsert.message}`);
      } else {
        console.log(`   ✅ Criados ${assentosParaCriar.length} assentos`);
        assentosAdicionados += assentosParaCriar.length;
      }
    }
  }
  
  return assentosAdicionados;
}

async function processarCabines(passagensMaritimas) {
  let cabinesAdicionadas = 0;
  
  for (const passagem of passagensMaritimas) {
    const { data: cabinesExistentes } = await supabase
      .from('trip_cabins')
      .select('id')
      .eq('trip_id', passagem.id);

    if (!cabinesExistentes || cabinesExistentes.length === 0) {
      console.log(`⚠️  Passagem marítima ${passagem.id} (${passagem.origin} → ${passagem.destination}) sem cabines`);
      
      const cabinesParaCriar = await criarCabinesPadrao(passagem);
      const { error: errorInsert } = await supabase
        .from('trip_cabins')
        .insert(cabinesParaCriar);

      if (errorInsert) {
        console.error(`   ❌ Erro ao criar cabines: ${errorInsert.message}`);
      } else {
        console.log(`   ✅ Criadas ${cabinesParaCriar.length} cabines`);
        cabinesAdicionadas += cabinesParaCriar.length;
      }
    }
  }
  
  return cabinesAdicionadas;
}

async function garantirSeatsCabins() {
  console.log('🔍 Verificando passagens sem assentos/cabines...\n');

  try {
    const { data: passagensAereas, error: errorAereas } = await supabase
      .from('trips')
      .select('id, origin, destination, type')
      .eq('type', 'air');

    if (errorAereas) throw errorAereas;
    console.log(`✈️  Encontradas ${passagensAereas.length} passagens aéreas`);

    const { data: passagensMaritimas, error: errorMaritimas } = await supabase
      .from('trips')
      .select('id, origin, destination, type')
      .eq('type', 'sea');

    if (errorMaritimas) throw errorMaritimas;
    console.log(`🚢 Encontradas ${passagensMaritimas.length} passagens marítimas\n`);

    const assentosAdicionados = await processarAssentos(passagensAereas);
    const cabinesAdicionadas = await processarCabines(passagensMaritimas);

    console.log('\n📊 Resumo:');
    console.log(`   ✈️  Assentos adicionados: ${assentosAdicionados}`);
    console.log(`   🚢 Cabines adicionadas: ${cabinesAdicionadas}`);
    console.log('\n✅ Processo concluído!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar
garantirSeatsCabins();


