import express from 'express';
import { AddMovie, Movies, deleteMovieById} from '../controllers/movie.controller.js';
import upload from '../middlewares/upload.middleware.js';
import {  totalUsers, getAllUsers, newUsers } from '../controllers/user.controller.js';
import { approveTheater, getApprovedTheaters, notApprovedTheaters } from '../controllers/theater.controller.js';
import { Transactions } from '../controllers/transaction.controller.js';
import { checkAdmin } from '../controllers/owner.controller.js';
import authenticateAdmin from '../middlewares/admin.middleware.js';
import { totalBookings } from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/add-movie',upload.single("image"),AddMovie);
router.delete('/delete-movie/:id', deleteMovieById);
router.get('/all-movies',Movies);
router.get('/all-users',getAllUsers);
router.get('/approved-theaters',getApprovedTheaters);
router.get('/not-approved-theaters',notApprovedTheaters);
router.put('/approve-theater/:id',approveTheater);

router.get('/check-admin',authenticateAdmin,checkAdmin )
router.get('/transactions',Transactions);




//additional stat routes

router.get('/total-users',totalUsers);
router.get('/total-bookings',totalBookings);

router.get('/new-registrations',newUsers)



export default router;