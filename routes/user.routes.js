import express from 'express';
import {Signup,Signin, Logout, checkUser, getUser} from '../controllers/user.controller.js';
import { GetShowsByDate, ShowSeats } from '../controllers/show.controller.js';
import { Movies,MovieDetails } from '../controllers/movie.controller.js';
import authenticateUser from '../middlewares/user.middleware.js';
import { createOrder, verifyPayment, viewBookingbyUser } from '../controllers/booking.controller.js';
import checkSeatStatus from '../middlewares/check-seat.middleware.js';
import { AddReview } from '../controllers/review.controller.js';


const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/logout',Logout);
router.get("/check-user",authenticateUser,checkUser)
router.get('/movies',Movies)
router.get('/movie-details/:id',authenticateUser,MovieDetails);
router.get('/shows',authenticateUser,GetShowsByDate);
router.get('/show-seats/:showId',authenticateUser,ShowSeats )

router.post('/create-order',authenticateUser,checkSeatStatus,createOrder);
router.post('/verify-payment',authenticateUser,verifyPayment)
router.get('/view-booking',authenticateUser,viewBookingbyUser)
router.post('/add-review',authenticateUser,AddReview)
router.get('/get-user',authenticateUser,getUser)



//additional stat routes

export default router;