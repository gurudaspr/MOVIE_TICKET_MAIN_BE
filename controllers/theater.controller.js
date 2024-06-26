
import Theater from "../models/theater.model.js";


export const AddTheater = async (req, res) => {
    const ownerId = req.owner.ownerId;
    try {
        const { name, location,selectedSeats} = req.body;
        if (!name || !location || !ownerId || !selectedSeats) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newTheatre = new Theater({
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



export const notApprovedTheaters = async (req, res) => { 
    try {
        const theaters = await Theater.find({approved : false}).populate('owner', 'name');
        res.status(200).json(theaters);
    }
    catch (error) {
        console.log("Error in theaters controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const approveTheater = async (req, res) => {
    try {
        const theaterId = req.params.id;
        const theater = await Theater.findByIdAndUpdate(theaterId, { approved: true });
        await theater.save();
        res.status(200).json({ message: "Theatre approved successfully" });
    }
    catch (error) {
        console.log("Error in approve theater controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
  

export const getApprovedTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ approved: true }).populate('owner', 'name');
        res.status(200).json(theaters);
    }
    catch (error) {
        console.log("Error in theaters controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}



export const totalTheaters = async (req, res) => {
    try {
        const approved = await Theater.find({ approved: true });
        const pending = await Theater.find({ approved: false });

        res.status(200).json({ approvedTheater: approved.length, pendingTheater: pending.length });
    } catch (error) {
        console.error('Error fetching total theaters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const selectTheater = async (req, res) => { 
    try {
        const ownerId = req.owner.ownerId;
        const theaters = await Theater.find( { owner : ownerId ,approved: true }).select('name').select('location');
        res.status(200).json(theaters);
    } catch (error) {
        console.error("Error fetching theaters", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const TheaterByOwner = async (req, res) => {
    const ownerId = req.owner.ownerId;
    try {
        const theaters = await Theater.find({ owner: ownerId });
        if (theaters.length === 0) {
            return res.status(404).json({ message: "No theaters found for this owner" });
        }
        res.status(200).json(theaters);
        
    } catch (error) {
        console.log("Error in get theaters controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


    