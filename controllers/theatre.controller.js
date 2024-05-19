
import Theatre from "../models/theatre.model.js";


export const AddTheatre = async (req, res) => {
    try {
        const { name, location, ownerId,selectedSeats} = req.body;
        if (!name || !location || !ownerId || !selectedSeats) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newTheatre = new Theatre({
            name,
            location,
            owner : ownerId,
            seatingPattern : selectedSeats
        });
        await newTheatre.save();
        if (!newTheatre) {
            return res.send("Theatre is not created");
        }
        res.status(201).json({ message: "Theatre added successfully" });
    }
    catch (error) {
        console.log("Error in add theatre controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}