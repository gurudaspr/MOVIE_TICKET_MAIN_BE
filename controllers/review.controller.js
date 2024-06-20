import Review from "../models/review.model.js";
import Movie from "../models/movie.model.js";


export const AddReview = async (req, res) => {
try {
    const { movieId, rating, review } = req.body;
    const userId = req.user.data;
    const newReview = new Review({
      movieId,
      userId,
      rating,
      review,
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
    await Movie.findByIdAndUpdate(movieId, {
      $push: { reviews: savedReview._id }
    });
    
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



//additonal

export const totalReviews = async (req, res) => {

  try {
      const review = await Review.find();
      res.status(200).json({ totalReviews: review.length });
  } catch (error) {
      console.error('Error fetching total reviews:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}
