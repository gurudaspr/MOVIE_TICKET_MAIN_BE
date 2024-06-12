import express from 'express';
import {Signup,Signin} from '../controllers/owner.controller.js';
import { AddTheater } from '../controllers/theater.controller.js';
import { AddShows } from '../controllers/show.controller.js';
import { selectMovie } from '../controllers/movie.controller.js';
import { Logout } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/logout',Logout);


router.post('/add-theater',AddTheater );
router.post('/add-shows',AddShows)
router.get('/select-movie',selectMovie)



export default router;