require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Listas de dados para gerar passagens aleatórias
const cities = [
  'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
  'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre',
  'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
  'Maceió', 'Natal', 'João Pessoa', 'Teresina', 'Florianópolis'
];

const ports = [
  'Santos', 'Rio de Janeiro', 'Salvador', 'Recife', 'Fortaleza',
  'Manaus', 'Belém', 'Vitória', 'Paranaguá', 'Itajaí',
  'São Francisco do Sul', 'Ilhéus', 'Maceió', 'Natal', 'Cabedelo'
];

const airlines = ['LATAM', 'GOL', 'Azul', 'Avianca', 'VoePass'];
const shipCompanies = ['Costa Cruzeiros', 'MSC', 'Royal Caribbean', 'Carnival', 'Princess Cruises'];

// Função para gerar data aleatória no futuro (próximos 90 dias)
function getRandomFutureDate(daysAhead = 90) {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAhead) + 1;
  const date = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

// Função para adicionar horas a uma data
function addHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate.toISOString();
}

// Função para gerar preço aleatório
function getRandomPrice(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Função para selecionar item aleatório de um array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Função para gerar duas cidades diferentes
function getRandomCities() {
  const origin = getRandomItem(cities);
  let destination = getRandomItem(cities);
  while (destination === origin) {
    destination = getRandomItem(cities);
  }
  return { origin, destination };
}

// Função para gerar dois portos diferentes
function getRandomPorts() {
  const origin = getRandomItem(ports);
  let destination = getRandomItem(ports);
  while (destination === origin) {
    destination = getRandomItem(ports);
  }
  return { origin, destination };
}

// Função para criar passagem aérea
async function createAirTrip() {
  const { origin, destination } = getRandomCities();
  const departureTime = getRandomFutureDate();
  const flightDuration = Math.floor(Math.random() * 5) + 1; // 1-5 horas
  const arrivalTime = addHours(departureTime, flightDuration);
  const airline = getRandomItem(airlines);
  const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`;

  const tripData = {
    type: 'air',
    origin: origin,
    destination: destination,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    price: getRandomPrice(200, 1500)
   // company: airline,
    //flight_number: flightNumber
  };

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert(tripData)
    .select()
    .single();

  if (tripError) {
    console.error('Erro ao criar viagem aérea:', tripError);
    return null;
  }

  // Criar assentos para a viagem aérea
  const numSeats = Math.floor(Math.random() * 100) + 50; // 50-150 assentos
  const seats = [];
  
  for (let i = 1; i <= numSeats; i++) {
    const row = Math.ceil(i / 6);
    const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][(i - 1) % 6];
    const seatNumber = `${row}${seatLetter}`;
    const seatClass = i <= numSeats * 0.2 ? 'Executiva' : 'Econômica';
    
    seats.push({
      trip_id: trip.id,
      seat_number: seatNumber,
      class: seatClass,
      available: Math.random() > 0.3 // 70% disponíveis
    });
  }

  const { error: seatsError } = await supabase
    .from('trip_seats')
    .insert(seats);

  if (seatsError) {
    console.error('Erro ao criar assentos:', seatsError);
  }

  return trip;
}

// Função para criar passagem marítima
async function createSeaTrip() {
  const { origin, destination } = getRandomPorts();
  const departureTime = getRandomFutureDate();
  const tripDuration = Math.floor(Math.random() * 48) + 12; // 12-60 horas
  const arrivalTime = addHours(departureTime, tripDuration);
  const company = getRandomItem(shipCompanies);
  const shipName = `${company} ${Math.floor(Math.random() * 20) + 1}`;

  const tripData = {
    type: 'sea',
    origin: origin,
    destination: destination,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    price: getRandomPrice(500, 3000)
    //company,
    //ship_name: shipName
  };

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert(tripData)
    .select()
    .single();

  if (tripError) {
    console.error('Erro ao criar viagem marítima:', tripError);
    return null;
  }

  // Criar cabines para a viagem marítima
  const numCabins = Math.floor(Math.random() * 100) + 30; // 30-130 cabines
  const cabins = [];
  
  for (let i = 1; i <= numCabins; i++) {
    const deck = Math.ceil(i / 20);
    const cabinNumber = `${deck}${String(i).padStart(3, '0')}`;
    const cabinTypes = ['Interna', 'Externa', 'Varanda', 'Suíte'];
    const cabinType = cabinTypes[Math.floor(Math.random() * cabinTypes.length)];
    
    cabins.push({
      trip_id: trip.id,
      cabin_number: cabinNumber,
      cabin_type: cabinType,
      capacity: cabinType === 'Suíte' ? 4 : 2,
      available: Math.random() > 0.3 // 70% disponíveis
    });
  }

  const { error: cabinsError } = await supabase
    .from('trip_cabins')
    .insert(cabins);

  if (cabinsError) {
    console.error('Erro ao criar cabines:', cabinsError);
  }

  return trip;
}

// Função principal
async function generateRandomTrips(numAirTrips = 20, numSeaTrips = 10) {
  console.log('🚀 Iniciando geração de passagens aleatórias...\n');

  let airTripsCreated = 0;
  let seaTripsCreated = 0;

  // Gerar passagens aéreas
  console.log(`✈️  Gerando ${numAirTrips} passagens aéreas...`);
  for (let i = 0; i < numAirTrips; i++) {
    const trip = await createAirTrip();
    if (trip) {
      airTripsCreated++;
      console.log(`   ✓ Viagem aérea ${i + 1}/${numAirTrips}: ${trip.origin} → ${trip.destination} (${trip.flight_number})`);
    }
  }

  console.log(`\n🚢 Gerando ${numSeaTrips} passagens marítimas...`);
  // Gerar passagens marítimas
  for (let i = 0; i < numSeaTrips; i++) {
    const trip = await createSeaTrip();
    if (trip) {
      seaTripsCreated++;
      console.log(`   ✓ Viagem marítima ${i + 1}/${numSeaTrips}: ${trip.origin} → ${trip.destination} (${trip.ship_name})`);
    }
  }

  console.log('\n✅ Geração concluída!');
  console.log(`   📊 Total: ${airTripsCreated} passagens aéreas e ${seaTripsCreated} passagens marítimas criadas.`);
}

// Executar o script
const numAirTrips = process.argv[2] ? parseInt(process.argv[2]) : 20;
const numSeaTrips = process.argv[3] ? parseInt(process.argv[3]) : 10;

generateRandomTrips(numAirTrips, numSeaTrips)
  .then(() => {
    console.log('\n🎉 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar script:', error);
    process.exit(1);
  });