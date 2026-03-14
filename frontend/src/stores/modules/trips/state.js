export default () => ({
  trips: [],
  currentTrip: null,
  seats: [],
  cabins: [],
  loading: false,
  error: null,
  filters: {
    type: null, // 'aerea' ou 'maritima'
    origin: null,
    destination: null,
    date: null
  }
})

// Made with Bob
