import express from 'express';
import {Signup,Signin, Logout, checkUser} from '../controllers/user.controller.js';
import { GetShowsByDate, ShowSeats } from '../controllers/show.controller.js';
import { Movies,MovieDetails } from '../controllers/movie.controller.js';
import authenticateUser from '../middlewares/user.middleware.js';
import { createOrder, verifyPayment, viewBookingbyUser } from '../controllers/booking.controller.js';
import checkSeatStatus from '../middlewares/check-seat.middleware.js';
import { AddReview } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/user/signup', Signup);
router.post('/user/signin', Signin);
router.post('/user/logout',Logout);
router.get("/user/check-user",authenticateUser,checkUser)
router.get('/movies',Movies)
router.get('/movie-details/:id',MovieDetails);
router.get('/shows',GetShowsByDate);
router.get('/show-seats/:showId',ShowSeats )

router.post('/create-order',checkSeatStatus,createOrder);
router.post('/verify-payment',authenticateUser,verifyPayment)
router.get('/view-booking',authenticateUser,viewBookingbyUser)
router.post('/add-review',authenticateUser,AddReview)


export default router;