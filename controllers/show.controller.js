import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";
import Theater from "../models/theater.model.js";
import  {  addMinutes, format, parse, parseISO, isAfter,startOfDay }  from 'date-fns';




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

      const combinedDateTimeString = `${showDate} ${showTime}`;
      const combinedDateTime = parse(combinedDateTimeString, "yyyy-MM-dd h:mm a", new Date());
      if (isNaN(combinedDateTime)) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }
  
      const existingShow = await Show.findOne({
        theater: theaterId,
        showDate: combinedDateTime,
      });
  
      const existingShows = await Show.find({
        theater: theaterId,
        showDate: {
          $gte: addMinutes(combinedDateTime, -150),
          $lte: addMinutes(combinedDateTime, 150),
        }
    });

    if (existingShows.length > 0) {
        return res.status(400).json({ message: "Another show exists within 3 hours of the specified time" });
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
      return res.status(400).json({ error: 'Date and movieId are required' });
    }

    const selectedDate = new Date(date);
    const startOfSelectedDate = startOfDay(selectedDate);
    const endOfSelectedDate = new Date(startOfSelectedDate);
    endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);

    const query = {
      showDate: {
        $gte: startOfSelectedDate,
        $lt: endOfSelectedDate
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
      const showDateTime = show.showDate;

      if (!acc[theaterName]) {
        acc[theaterName] = { theater: theaterName, theaterLocation: theaterLocation, movieName: movieName, showTimes: [] };
      }

      const formattedShowTime = format(showDateTime, 'h:mm a');

 
      const currentDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      if (isAfter(showDateTime, currentDateTime)) {
        acc[theaterName].showTimes.push({ showTime: formattedShowTime, showId: show._id });
      }

      return acc;
    }, {});

    const formattedShows = Object.values(groupedShows);
    res.status(200).json(formattedShows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const ShowSeats = async (req, res) => {
    console.log("Fetching seating pattern");
    try {
      const { showId } = req.params;
      console.log('ShowId:', showId);
  
      const show = await Show.findById(showId);
  
  
      if (!show) {
        return res.status(404).json({ message: "Show not found" });
      }
      
      res.status(200).json({ showSeating: show.showSeating,price: show.price});

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching seating pattern" });
    }
  };




  //additional 


  export const ShowStats = async (req, res) => {
    try {
        const shows = await Show.find();
        const upComingShows = shows.filter(show => show.showDate > new Date());
        res.status(200).json({ totalShows: shows.length, upComingShows: upComingShows.length});

    } catch (error) {
        console.error('Error fetching total shows:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }



  export const getShowByOwner = async (req, res) => {
    const ownerId = req.owner.ownerId;
    try {
      const theaters = await Theater.find({ owner: ownerId });
  
      if (theaters.length === 0) {
        return res.status(404).json({ message: "No theaters found for this owner" });
      }
      const theaterIds = theaters.map(theater => theater._id);
      const shows = await Show.find({ theater: { $in: theaterIds } }).populate('movieId');
  
      const showDetails = shows.map(show => {
        const theater = theaters.find(t => t._id.equals(show.theater));
        return {
          movieName: show.movieId.title,
          movieImage: show.movieId.image,
          showDate: show.showDate,
          price: show.price,
          theaterName: theater.name
        };
      });
  
      res.status(200).json(showDetails);
    } catch (error) {
      console.log("Error in get shows controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };












//    export const GetShowsByDate = async (req, res) => {
//   const { date, movieId } = req.query;
//   try {
//     if (!date || !movieId) {
//       return res.status(400).json({ error: 'Date and movieId are required' });
//     }

//     const selectedDate = new Date(date);
//     const startOfSelectedDate = startOfDay(selectedDate);
//     const endOfSelectedDate = new Date(startOfSelectedDate);
//     endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);

//     const query = {
//       showDate: {
//         $gte: startOfSelectedDate,
//         $lt: endOfSelectedDate
//       },
//       movieId: movieId
//     };

//     const shows = await Show.find(query)
//       .populate('theater')
//       .populate('movieId');

//     const groupedShows = shows.reduce((acc, show) => {
//       const theaterName = show.theater.name;
//       const movieName = show.movieId.title;
//       const theaterLocation = show.theater.location;
//       const showDateTime = show.showDate;

//       if (!acc[theaterName]) {
//         acc[theaterName] = { theater: theaterName, theaterLocation: theaterLocation, movieName: movieName, showTimes: [] };
//       }

//       const formattedShowTime = format(showDateTime, 'h:mm a');

 
//       const currentDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
//       if (isAfter(showDateTime, currentDateTime)) {
//         acc[theaterName].showTimes.push({ showTime: formattedShowTime, showId: show._id });
//       }

//       return acc;
//     }, {});

//     const formattedShows = Object.values(groupedShows);
//     res.status(200).json(formattedShows);
//   } catch (error) {
//     console.error('Error fetching shows:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };