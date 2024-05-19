import bcrypt from "bcrypt";
import User from '../models/user.model.js';
import { generateToken } from "../utils/generateToken.js";

export const Signup = async (req, res) => {

    try{
        const {name, email, password, confirmPassword,} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({error: "All fields are required"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({error: "Password and confirm password do not match"});
        }
        const userExist = await User.findOne({email: email});
        if(userExist){
            return res.status(400).json({error: "User  already exists"});
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
          const token = generateToken(email);
          res.cookie("token", token);

        res.status(201).json({message: "User created successfully"});
    }
    catch(error){
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
        const token = generateToken(email);
        res.cookie("token", token);
        res.status(200).json({ message: "User signed in successfully" });
        }
        catch (error){
            console.log("Error in signin controller", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    