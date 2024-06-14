import bcrypt from "bcrypt";
import Owner from '../models/owner.model.js';
import { adminToken } from "../utils/generateToken.js";

export const Signup = async (req, res) => {
        console.log('signup');
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
        res.status(200).json({ message: ' Logged in successfully', role: owner.role });
        }
        catch (error){
            console.log("Error in signin controller", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    

 export  const Logout = async (req, res) => {  
    try {
        const token = req.cookies.token;
        res.cookie('token', '', {  maxAge: 0, httpOnly: true, sameSite: "none",secure: process.env.NODE_ENV !== "development",});
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const checkOwner = async (req, res) => {
    const owner = req.owner;
  try {
    const ownerData = await Owner.findOne({ _id: owner.ownerId });
    if (!ownerData) {
      return res.status(404).json({ message: "owner not found", success: false });
    }

    if (ownerData.role !== "owner") {
      return res.status(403).json({message: "authentication failed", success: false  });
    }

    res.status(200).json({ message: "authenticateOwner", success: true });
  } catch (error) {
    console.error("Error while checking owner status:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
   

export const checkAdmin = async (req, res) => { 
    const owner = req.owner;
  try {
    const adminData = await Owner.findOne({ _id: owner.ownerId });
    if (!adminData) {
      return res.status(404).json({ message: "owner not found", success: false });
    }

    if (adminData.role !== "admin") {
      return res.status(403).json({message: "authentication failed", success: false  });
    }
    res.status(200).json({ message: "authenticateAdmin", success: true });
  } catch (error) {
    console.error("Error while checking owner status:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
}