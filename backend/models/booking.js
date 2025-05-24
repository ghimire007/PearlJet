import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  flight: {
    origin: String,
    destination: String,
    flightNumber: String,
    class: String,
    price: Number,
    departureDateTime: String,
    arrivalDateTime: String,
    id: String
  },
  passenger: {
    name: String,
    seat: String,
    services: [
      {
        name: String,
        price: Number
      }
    ]
  },
  billingAddress: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  paymentInfo: {
    cardHolderName: String,
    cardNumber: String,
    expiryDate: String,
    cvc: String
  },
  status: { type: String, default: 'confirmed' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking; 