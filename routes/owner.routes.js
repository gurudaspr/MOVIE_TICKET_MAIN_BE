import express from 'express';
import {Signup,Signin, checkOwner, Logout} from '../controllers/owner.controller.js';
import { AddTheater } from '../controllers/theater.controller.js';
import { AddShows } from '../controllers/show.controller.js';
import { selectMovie } from '../controllers/movie.controller.js';
import authenticateOwner from '../middlewares/owner.middleware.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/logout',Logout);
router.post('/add-theater',authenticateOwner,AddTheater );
router.post('/add-shows',AddShows)
router.get('/select-movie',authenticateOwner,selectMovie)

router.get('/check-owner',authenticateOwner,checkOwner)


export default router;