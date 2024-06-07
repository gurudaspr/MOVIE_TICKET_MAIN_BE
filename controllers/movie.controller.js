import Movie from "../models/movie.model.js";
import Review from "../models/review.model.js";
import cloudinaryInstance from "cloudinary";



export const AddMovie = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }

        const { title, duration, genre, releaseDate, language,description } = req.body;
        const result = await cloudinaryInstance.uploader.upload(req.file.path);
        const imageUrl = result.url;

        if (!title || !duration || !genre || !releaseDate || !language || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        const newMovie = new Movie({
            title,
            duration,
            genre,
            releaseDate,
            description,
            language,
            image : imageUrl,
        });
        await newMovie.save();
        if (!newMovie) {
            return res.send("Movie is not created");
        }
        res.status(201).json({ message: "Movie created successfully" });
    }
    catch (error) {
        console.log("Error in add movie controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Movies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    }
    catch (error) {
        console.log("Error in movies controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}


export const MovieDetails = async (req, res) => {
    const id = req.params.id;
    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(400).json({ error: "Movie not found" });
        }
        const movieDetails = await Movie.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'name'
            }
        });
        res.status(200).json(movieDetails);
    }
    catch (error) {
        console.log("Error in movie details controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export  const selectMovie = async (req, res) => {
    try {
      const movies = await Movie.find().select('title');
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  