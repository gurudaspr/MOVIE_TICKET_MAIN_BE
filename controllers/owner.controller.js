import bcrypt from "bcrypt";
import Owner from '../models/owner.model.js';
import { adminToken } from "../utils/generateToken.js";

export const Signup = async (req, res) => {

    try{
        const {name, email, password, confirmPassword,} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({error: "All fields are required"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({error: "Password and confirm password do not match"});
        }
        const ownerExist = await Owner.findOne({email: email});
        if(ownerExist){
            return res.status(400).json({error: "Owner  already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newOwner = new Owner({
            name,
            email,
            password: hashedPassword,
            role: 'owner'
        });

        await newOwner.save();
        if (!newOwner) {
            return res.send("owner is not created");
          }
        res.status(201).json({message: "Owner created successfully"});
    }
    catch(error){
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const owner = await Owner.findOne({ email: email });
        if (!owner) {
          return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = adminToken(owner);
        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none", 
            secure: process.env.NODE_ENV !== "development", 
        });
        res.status(200).json({ message: "Owner signed in successfully" });
        }
        catch (error){
            console.log("Error in signin controller", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    