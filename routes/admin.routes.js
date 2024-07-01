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

router.post('/add-movie',authenticateAdmin,upload.single("image"),AddMovie);
router.delete('/delete-movie/:id',authenticateAdmin, deleteMovieById);
router.get('/all-movies',authenticateAdmin,Movies);
router.get('/all-users',authenticateAdmin,getAllUsers);
router.get('/approved-theaters',authenticateAdmin,getApprovedTheaters);
router.get('/not-approved-theaters',authenticateAdmin,notApprovedTheaters);
router.put('/approve-theater/:id',authenticateAdmin,approveTheater);
router.get('/check-admin',authenticateAdmin,checkAdmin )
router.get('/transactions',authenticateAdmin,Transactions);





//additional stat routes

router.get('/total-users',authenticateAdmin,totalUsers);
router.get('/total-bookings',authenticateAdmin,totalBookings);
router.get('/new-registrations',authenticateAdmin,newUsers)
router.get('/total-reviews',authenticateAdmin,totalReviews)
router.get('/total-theaters',authenticateAdmin,totalTheaters);
router.get('/total-shows',authenticateAdmin,ShowStats)
router.get('/total-movies',authenticateAdmin,totalMovies)
router.get('/total-transaction',authenticateAdmin,TotalTransactions)


export default router;