import bcrypt from "bcrypt";
import User from '../models/user.model.js';
import { generateToken } from "../utils/generateToken.js";

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
        res.clearCookie("token",);

        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const checkUser = async (req, res) => {
    async (req, res) => {

        const user = req.user;
    
        const findUser = await User.findOne({ email: user.data });
      
        if (!findUser) {
          return res.json({ message: "authentication failed", success: false });
        }
        
        res.json({ message: "authenticateUser", success: true });
    }    

}
