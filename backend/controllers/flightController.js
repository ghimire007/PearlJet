import Flight from '../models/flight.js';
import mongoose from 'mongoose';

// Search flights based on query params
export const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, minPrice, maxPrice, class: flightClass } = req.query;
    let query = {};
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    if (date) query.departureDateTime = { $regex: `^${date}` };
    if (flightClass) query.class = flightClass;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const flights = await Flight.find(query);
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getFlightById = async (req, res) => {
  try {
    let flight;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      flight = await Flight.findById(req.params.id);
    }
    if (!flight) {
      // Try to find by custom id field (number)
      flight = await Flight.findOne({ id: req.params.id });
      if (!flight) flight = await Flight.findOne({ id: Number(req.params.id) });
    }
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 