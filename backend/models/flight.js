import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  type: String,
  airline: String,
  flightNumber: String,
  class: String,
  price: Number,
  stops: Number,
  duration: String,
  departureDateTime: String,
  arrivalDateTime: String
});

const Flight = mongoose.model('Flight', flightSchema);
export default Flight; 