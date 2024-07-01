import express from 'express';
import {Signup,Signin, checkOwner, Logout} from '../controllers/owner.controller.js';
import { AddTheater, TheaterByOwner, selectTheater } from '../controllers/theater.controller.js';
import { AddShows, getShowByOwner } from '../controllers/show.controller.js';
import { Movies, selectMovie } from '../controllers/movie.controller.js';
import authenticateOwner from '../middlewares/owner.middleware.js';
import { TotalMovies, TotalSeatsSold, totalBookings, totalRevenue, totalShows } from '../controllers/stats.controller.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/logout',Logout);
router.post('/add-theater',authenticateOwner,AddTheater );
router.post('/add-shows',authenticateOwner,AddShows)
router.get('/select-movie',authenticateOwner,selectMovie)
router.get('/select-theater',authenticateOwner,selectTheater)
router.get('/check-owner',authenticateOwner,checkOwner)
router.get('/get-shows',authenticateOwner,getShowByOwner)
router.get('/all-movies',authenticateOwner,Movies);
router.get('/my-theaters',authenticateOwner,TheaterByOwner)

//stat routes

router.get('/total-movies',authenticateOwner,TotalMovies)
router.get('/total-shows',authenticateOwner,totalShows)
router.get('/total-income',authenticateOwner,totalRevenue)
router.get('/total-bookings',authenticateOwner,totalBookings)
router.get('/total-tickets-sold',authenticateOwner,TotalSeatsSold)



export default router;