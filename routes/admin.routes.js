import express from 'express';
import { AddMovie} from '../controllers/movie.controller.js';
import upload from '../middlewares/upload.middleware.js';
import authenticateOwner from '../middlewares/owner.middleware.js';


const router = express.Router();

router.post('/add',upload.single("image"),AddMovie);
export default router;