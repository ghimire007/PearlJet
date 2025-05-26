import Booking from '../models/booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    console.log(req.user);
    const booking = new Booking({
      ...req.body,
      user: req.user._id // Assume user is authenticated and _id is available
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all bookings for the current user
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      user: req.user._id,// Exclude canceled bookings
    }).sort({ createdAt: -1 });  // Sort by creation date, newest first
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all upcoming bookings for the current user
export const getUpcomingBookings = async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Booking.find({ 
      user: req.user._id,
      status: { $ne: 'canceled' }  // Exclude canceled bookings
    }).sort({ createdAt: -1 });  // Sort by creation date, newest first
    
    // Filter in JS: parse the string to Date and compare
    const upcoming = bookings.filter(b => {
      const dep = b.flight?.departureDateTime;
      return dep && new Date(dep) >= now;
    });
    console.log(upcoming);
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'canceled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 