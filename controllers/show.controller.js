import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";
import Theater from "../models/theater.model.js";
import  { format, parse, parseISO }  from 'date-fns';



export const AddShows = async (req, res) => {
    try {
      const { movieId, theaterId, showDate, showTime, price } = req.body;
  
      if (!movieId || !theaterId || !showDate || !showTime || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      console.log(showDate, showTime);
  
      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return res.status(400).json({ message: "Invalid theater ID" });
      }
  
      if (!theater.approved) {
        return res.status(403).json({ message: "Theater is not approved" });
      }

      const combinedDateTimeString = `${showDate} ${showTime}`;
      const combinedDateTime = parse(combinedDateTimeString, "yyyy-MM-dd h:mm a", new Date());
  
      console.log(combinedDateTime);
  
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
        movieId: movieId,
        theater: theaterId,
        showDate: combinedDateTime,
        showSeating: showSeatingpattern,
        price
      });
  
      const savedShow = await newShow.save();
      res.status(201).json(savedShow);
    } catch (error) {
      console.log("Error in add show controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

// export const GetShows = async (req, res) => {
//     const showId = req.params.id;   
//     try {
//         const shows = await Show.findById(showId)
//         res.status(200).json(shows);
       
//     }
//     catch (error) {
//         console.log("Error in get shows controller", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

export const GetShowsByDate = async (req, res) => {
    const { date, movieId } = req.query;
    try {
        if (!date || !movieId) {
            return res.status(400).json({ error: 'Date is required' });
        }
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        const query = {
            showDate: {
                $gte: startDate,
                $lt: endDate
            },
            movieId: movieId
        };
        const shows = await Show.find(query)
            .populate('theater')
            .populate('movieId');
        const groupedShows = shows.reduce((acc, show) => {
            const theaterName = show.theater.name;
            const movieName = show.movieId.title;
            const theaterLocation = show.theater.location;
            
            if (!acc[theaterName]) {
                acc[theaterName] = { theater: theaterName, theaterLocation: theaterLocation, movieName: movieName, showTimes: [] }; 
            }
            const showTime = format(show.showDate, 'h:mm a');
            acc[theaterName].showTimes.push({ showTime, showId: show._id });
            return acc;
        }, {});
        const formattedShows = Object.values(groupedShows);
        res.status(200).json(formattedShows);
    } catch (error) {
        console.error('Error fetching shows:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const ShowSeats = async (req, res) => {
    console.log("Fetching seating pattern");
    try {
      const { showId } = req.params;
      console.log('ShowId:', showId);
  
      const show = await Show.findById(showId);
    //   console.log('Show:', show);
  
      if (!show) {
        return res.status(404).json({ message: "Show not found" });
      }
      
      res.status(200).json({ showSeating: show.showSeating,price: show.price});

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching seating pattern" });
    }
  };

