import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";
import Theater from "../models/theatre.model.js";




export const AddShows = async (req, res) => {

    try {
        const { movieId, theaterId, showDate, showTime, price } = req.body;

        if (!movieId || !theaterId || !showDate || !showTime || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res.status(400).json({ message: "Invalid theater ID" });
        }
        if (!theater.approved) {
            return res.status(403).json({ message: "Theater is not approved" });
        }
        // if (theater.owner.toString() !== req.user.id) {
        //     return res.status(403).json({ message: "You are not authorized to add shows to this theater" });
        //   }
        const movie = await Movie.findById(movieId);
        if (!movie) {
          return res.status(400).json({ message: "Invalid movie ID" });
        }
        const combinedDateTimeString = `${showDate}T${showTime}:00.000Z`;
        const combinedDateTime = new Date(combinedDateTimeString);
        if (isNaN(combinedDateTime)) {
            return res.status(400).json({ message: "Invalid date or time format" });
        }
        const existingShow = await Show.findOne({
            theater: theaterId,
            showDate: combinedDateTime,
            
          });
          if (existingShow) {
            return res.status(400).json({ message: "A show already exists for the same date and time in this theater" });
          }

        const seatingPattern = theater.seatingPattern;
        const showSeatingpattern = JSON.parse(JSON.stringify(seatingPattern));
        const newShow = new Show({
            movieTitle : movie.title,
            theater: theaterId,
            showDate: combinedDateTime,
            showSeating: showSeatingpattern,
            price
        });
        const savedShow = await newShow.save();
        res.status(201).json(savedShow);
    }
    catch (error) {
        console.log("Error in add show controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}