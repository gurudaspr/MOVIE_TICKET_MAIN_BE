import Movie from "../models/movie.model.js";
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
        res.status(201).json({ message: "Movie created successfully", movie: newMovie});
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
      const movies = await Movie.find().select('title').select('releaseDate');
      res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

export const deleteMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const publicId = movie.image.split('/').pop().split('.')[0];
        await cloudinaryInstance.uploader.destroy(publicId); 
        await Movie.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error in delete movie controller', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const  totalMovies = async (req, res) => {

    try {
        const movies = await Movie.find();
        res.status(200).json({ totalMovies: movies.length });
    } catch (error) {
        console.error('Error fetching total movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
