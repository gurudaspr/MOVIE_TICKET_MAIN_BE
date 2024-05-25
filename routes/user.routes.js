import express from 'express';
import {Signup,Signin} from '../controllers/user.controller.js';
import { GetShows, GetShowsByDate, ShowSeats } from '../controllers/show.controller.js';
import Show from '../models/show.model.js';
import mongoose from 'mongoose';
import { Movies } from '../controllers/movie.controller.js';

const router = express.Router();

router.post('/user/signup', Signup);
router.post('/user/signin', Signin);
router.get('/movies',Movies)
router.get('/shows',GetShowsByDate);
router.get('/show-seats/:showId',ShowSeats )


export default router;