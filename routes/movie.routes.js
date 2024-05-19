import express from 'express';
import { AddMovie, MovieDetails} from '../controllers/movie.controller.js';
import upload from '../middlewares/upload.middleware.js';


const router = express.Router();

router.post('/add',upload.single("image"),AddMovie);
router.get('/details/:id',MovieDetails);

export default router;