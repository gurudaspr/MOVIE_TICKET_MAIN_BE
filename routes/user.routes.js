import express from 'express';
import {Signup,Signin} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/user/signup', Signup);


router.post('/user/signin', Signin);


export default router;