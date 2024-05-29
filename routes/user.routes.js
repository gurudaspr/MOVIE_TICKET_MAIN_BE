import express from 'express';
import {Signup,Signin, Logout} from '../controllers/user.controller.js';
import { GetShowsByDate, ShowSeats } from '../controllers/show.controller.js';
import { Movies,MovieDetails } from '../controllers/movie.controller.js';
import User from '../models/user.model.js';
import authenticateUser from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/user/signup', Signup);
router.post('/user/signin', Signin);
router.get('/user/logout',Logout);
router.get('/movies',Movies)
router.get('/movie-details/:id',MovieDetails);
router.get('/shows',GetShowsByDate);
router.get('/show-seats/:showId',ShowSeats )




router.get("/user/check-user",authenticateUser, async (req, res) => {

    const user = req.user;

    const findUser = await User.findOne({ email: user.data });
  
    if (!findUser) {
      return res.json({ message: "authentication failed", success: false });
    }
    
    res.json({ message: "authenticateUser", success: true });
  });


export default router;