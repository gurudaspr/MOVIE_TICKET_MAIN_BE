import express from 'express';
import { AddMovie} from '../controllers/movie.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { getAllUsers } from '../controllers/user.controller.js';
import { approveTheater, getAllTheaters, notApprovedTheaters } from '../controllers/theater.controller.js';


const router = express.Router();

router.post('/add-movie',upload.single("image"),AddMovie);
router.get('/all-users',getAllUsers);
router.get('/theaters',getAllTheaters);
router.get('/not-approved-theaters',notApprovedTheaters);
router.put('/approve-theater/:id',approveTheater);

export default router;