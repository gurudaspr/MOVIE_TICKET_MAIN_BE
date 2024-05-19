import express from 'express';
import {Signup,Signin} from '../controllers/owner.controller.js';
import { AddTheatre } from '../controllers/theatre.controller.js';
import { AddShows } from '../controllers/show.controller.js';
import { selectMovie } from '../controllers/movie.controller.js';

const router = express.Router();

router.post('/owner/signup', Signup);
router.post('/owner/signin', Signin);


router.post('/add-theatre',AddTheatre );
router.post('/add-shows',AddShows)
router.get('/select-movie',selectMovie)



export default router;