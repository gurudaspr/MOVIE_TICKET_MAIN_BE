import Review from "../models/review.model.js";


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
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}