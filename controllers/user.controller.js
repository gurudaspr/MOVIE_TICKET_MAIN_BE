import bcrypt from "bcrypt";
import User from '../models/user.model.js';
import { generateToken } from "../utils/generateToken.js";
import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";

export const Signup = async (req, res) => {
    console.log('hitting signup controller');

    try {
        const { name, email, password, confirmPassword, } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and confirm password do not match" });
        }
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).json({ error: "User  already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        if (!newUser) {
            return res.send("user is not created");
        }
        res.status(201).json({ message: "User created successfully" }); 
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none", 
            secure: process.env.NODE_ENV !== "development",
        });
        res.status(200).json({ message: "User signed in successfully", userId: user._id });
    }
    catch (error) {
        console.log("Error in signin controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Logout = async (req, res) => {

    try {
        const token = req.cookies.token;
        // console.log('token:', token);

        res.cookie('token', '', {  maxAge: 0, httpOnly: true, sameSite: "none",secure: process.env.NODE_ENV !== "development",});
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const checkUser = async (req, res) => {
        const user = req.user;
    
        const findUser = await User.findOne({ _id : user.data});
        if (!findUser) {
          return res.json({ message: "authentication failed", success: false });
        }
        
        res.json({ message: "authenticateUser", success: true });
    }    

export const getUser = async (req, res) => {
    try {
        const userId = req.user.data;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userData = {
        name: user.name,
        email: user.email,
      };
      res.json(userData);
      console.log('userData:', userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  ;

  export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const usersWithStats = await Promise.all(users.map(async user => {
          const bookings = await Booking.find({ userId: user._id });
          const reviews = await Review.find({ userId: user._id });
          return {
            ...user._doc,
            totalBookings: bookings.length,
            totalReviews: reviews.length
          };
        }));
        res.json(usersWithStats);
      } catch (error) {
        console.error('Error fetching users with stats:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };



//additonal

export const totalUsers = async (req, res) => {

    try {
        const users = await User.find();
        res.status(200).json({ totalUsers: users.length });
    } catch (error) {
        console.error('Error fetching total users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



export const newUsers = async (req, res) => { 
  try {
    const newRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    res.json(newRegistrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch new registrations' });
  }
};