import express from 'express';
import { AddMovie, Movies, deleteMovieById} from '../controllers/movie.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { getAllUsers } from '../controllers/user.controller.js';
import { approveTheater, getApprovedTheaters, notApprovedTheaters } from '../controllers/theater.controller.js';


const router = express.Router();

router.post('/add-movie',upload.single("image"),AddMovie);
router.delete('/delete-movie/:id', deleteMovieById);
router.get('/all-movies',Movies);
router.get('/all-users',getAllUsers);
router.get('/approved-theaters',getApprovedTheaters);
router.get('/not-approved-theaters',notApprovedTheaters);
router.put('/approve-theater/:id',approveTheater);

export default router;