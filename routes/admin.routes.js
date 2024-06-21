import express from 'express';
import { AddMovie, Movies, deleteMovieById, selectMovie, totalMovies} from '../controllers/movie.controller.js';
import upload from '../middlewares/upload.middleware.js';
import {  totalUsers, getAllUsers, newUsers } from '../controllers/user.controller.js';
import { approveTheater, getApprovedTheaters, notApprovedTheaters, totalTheaters } from '../controllers/theater.controller.js';
import { TotalTransactions, Transactions } from '../controllers/transaction.controller.js';
import { checkAdmin } from '../controllers/owner.controller.js';
import authenticateAdmin from '../middlewares/admin.middleware.js';
import { totalBookings } from '../controllers/booking.controller.js';
import { totalReviews } from '../controllers/review.controller.js';
import { ShowStats } from '../controllers/show.controller.js';

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
router.get('/total-reviews',totalReviews)
router.get('/total-theaters',totalTheaters);
router.get('/total-shows',ShowStats)
router.get('/total-movies',totalMovies)
router.get('/total-transaction',TotalTransactions)


export default router;