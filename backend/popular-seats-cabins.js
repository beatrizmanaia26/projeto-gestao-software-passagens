require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Função para criar assentos para uma viagem aérea
async function createSeatsForTrip(trip) {
  console.log(`   Criando assentos para viagem ${trip.id}: ${trip.origin} → ${trip.destination}`);
  
  const seats = [];
  
  // Classe Econômica: A1-A30, B1-B30, C1-C30 (90 assentos)
  for (let i = 1; i <= 30; i++) {
    seats.push({
      trip_id: trip.id,
      seat_number: `A${i}`,
      class: 'Econômica',
      available: true
    });
    seats.push({
      trip_id: trip.id,
      seat_number: `B${i}`,
      class: 'Econômica',
      available: true
    });
    seats.push({
      trip_id: trip.id,
      seat_number: `C${i}`,
      class: 'Econômica',
      available: true
    });
  }
  
  // Classe Executiva: D1-D20, E1-E20 (40 assentos)
  for (let i = 1; i <= 20; i++) {
    seats.push({
      trip_id: trip.id,
      seat_number: `D${i}`,
      class: 'Executiva',
      available: true
    });
    seats.push({
      trip_id: trip.id,
      seat_number: `E${i}`,
      class: 'Executiva',
      available: true
    });
  }
  
  // Primeira Classe: F1-F10 (10 assentos)
  for (let i = 1; i <= 10; i++) {
    seats.push({
      trip_id: trip.id,
      seat_number: `F${i}`,
      class: 'Primeira Classe',
      available: true
    });
  }

  const { error } = await supabase
    .from('trip_seats')
    .insert(seats);

  if (error) {
    console.error(`   ❌ Erro ao criar assentos:`, error.message);
    return 0;
  }

  console.log(`   ✓ ${seats.length} assentos criados`);
  return seats.length;
}

// Função para criar cabines para uma viagem marítima
async function createCabinsForTrip(trip) {
  console.log(`   Criando cabines para viagem ${trip.id}: ${trip.origin} → ${trip.destination}`);
  
  const cabins = [];
  
  // Cabine Interna: 101-150 (50 cabines, capacidade 2)
  for (let i = 101; i <= 150; i++) {
    cabins.push({
      trip_id: trip.id,
      cabin_number: i.toString(),
      cabin_type: 'Interna',
      capacity: 2,
      available: true
    });
  }
  
  // Cabine Externa: 201-240 (40 cabines, capacidade 2)
  for (let i = 201; i <= 240; i++) {
    cabins.push({
      trip_id: trip.id,
      cabin_number: i.toString(),
      cabin_type: 'Externa',
      capacity: 2,
      available: true
    });
  }
  
  // Cabine com Varanda: 301-330 (30 cabines, capacidade 2)
  for (let i = 301; i <= 330; i++) {
    cabins.push({
      trip_id: trip.id,
      cabin_number: i.toString(),
      cabin_type: 'Varanda',
      capacity: 2,
      available: true
    });
  }
  
  // Suíte: 401-410 (10 cabines, capacidade 4)
  for (let i = 401; i <= 410; i++) {
    cabins.push({
      trip_id: trip.id,
      cabin_number: i.toString(),
      cabin_type: 'Suíte',
      capacity: 4,
      available: true
    });
  }

  const { error } = await supabase
    .from('trip_cabins')
    .insert(cabins);

  if (error) {
    console.error(`   ❌ Erro ao criar cabines:`, error.message);
    return 0;
  }

  console.log(`   ✓ ${cabins.length} cabines criadas`);
  return cabins.length;
}

// Função principal
async function populateSeatsAndCabins() {
  console.log('🚀 Iniciando população de assentos e cabines...\n');

  // Buscar todas as viagens aéreas
  const { data: airTrips, error: airError } = await supabase
    .from('trips')
    .select('*')
    .eq('type', 'aerea');

  if (airError) {
    console.error('❌ Erro ao buscar viagens aéreas:', airError);
    return;
  }

  console.log(`✈️  Encontradas ${airTrips.length} viagens aéreas`);
  let totalSeats = 0;

  for (const trip of airTrips) {
    // Verificar se já tem assentos
    const { data: existingSeats } = await supabase
      .from('trip_seats')
      .select('id')
      .eq('trip_id', trip.id)
      .limit(1);

    if (existingSeats && existingSeats.length > 0) {
      console.log(`   ⏭️  Viagem ${trip.id} já possui assentos, pulando...`);
      continue;
    }

    const seatsCreated = await createSeatsForTrip(trip);
    totalSeats += seatsCreated;
  }

  // Buscar todas as viagens marítimas
  const { data: seaTrips, error: seaError } = await supabase
    .from('trips')
    .select('*')
    .eq('type', 'maritima');

  if (seaError) {
    console.error('❌ Erro ao buscar viagens marítimas:', seaError);
    return;
  }

  console.log(`\n🚢 Encontradas ${seaTrips.length} viagens marítimas`);
  let totalCabins = 0;

  for (const trip of seaTrips) {
    // Verificar se já tem cabines
    const { data: existingCabins } = await supabase
      .from('trip_cabins')
      .select('id')
      .eq('trip_id', trip.id)
      .limit(1);

    if (existingCabins && existingCabins.length > 0) {
      console.log(`   ⏭️  Viagem ${trip.id} já possui cabines, pulando...`);
      continue;
    }

    const cabinsCreated = await createCabinsForTrip(trip);
    totalCabins += cabinsCreated;
  }

  console.log('\n✅ População concluída!');
  console.log(`   📊 Total: ${totalSeats} assentos e ${totalCabins} cabines criados.`);
}

// Executar o script
populateSeatsAndCabins()
  .then(() => {
    console.log('\n🎉 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error);
    process.exit(1);
  });


