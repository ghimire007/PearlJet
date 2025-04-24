import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  title: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  countryOfResidence: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  cardDetails: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cardHolderName: { type: String },
    cvc: { type: String }
  },
  billingAddress: {
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
  },
  password: { type: String, required: true }
});

const User = mongoose.model('users', userSchema);

export { User }; 