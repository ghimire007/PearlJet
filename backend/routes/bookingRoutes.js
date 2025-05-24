import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUpcomingBookings
} from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

// router.use(auth); // Uncomment to protect all routes

router.post('/', verifyToken, createBooking);
router.get('/',verifyToken, getBookings);
router.get('/upcoming', verifyToken, getUpcomingBookings);
router.get('/:id', verifyToken, getBookingById);
router.put('/:id', verifyToken, updateBooking); 
router.delete('/:id', verifyToken, deleteBooking);

export default router; 