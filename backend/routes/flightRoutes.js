import express from 'express';
import { searchFlights, getFlightById } from '../controllers/flightController.js';

const router = express.Router();

router.get('/search', searchFlights);
router.get('/:id', getFlightById);

export default router; 