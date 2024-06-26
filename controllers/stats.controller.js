import Booking from "../models/booking.model.js";
import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";
import Theater from "../models/theater.model.js";




export const TotalMovies = async (req, res) => {
    try {
        const totalMovies = await Movie.countDocuments();
        res.status(200).json({ totalMovies });
    }
    catch (error) {
        console.log("Error in total movies controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const totalShows = async (req, res) => {
    const ownerId = req.owner.ownerId;
    try {
        const totalShows = await Show.countDocuments({ theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') } });
        res.status(200).json({ totalShows });
    } catch (error) {
        console.log("Error in total shows controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const totalRevenue = async (req, res) => {
    try {
        const ownerId = req.owner.ownerId;
        const totalRevenue = await Booking.aggregate([
            {
                $match: { showId: { $in: await Show.find({ theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') } }).distinct('_id') } }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);
        const totalAmount = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;

        res.json({ totalIncome: totalAmount });
    } catch (error) {
        console.error('Error fetching total revenue:', error.message);
        res.status(500).json({ error: 'Failed to fetch total revenue' });
    }
}


export const totalBookings = async (req, res) => {
    try {
        const ownerId = req.owner.ownerId;
        const totalBooking = await Booking.aggregate([
            {
                $match: { showId: { $in: await Show.find({ theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') } }).distinct('_id') } }
            },
            {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                  },
                  count: { $sum: 1 },
                },
              },
              {
                $sort: {
                  '_id.year': 1,
                  '_id.month': 1,
                },
              },
            ]);
            res.json(totalBooking);
    }
    catch (error) {
        console.error('Error fetching total booking:', error.message);
        res.status(500).json({ error: 'Failed to fetch total booking' });
    }
}



export const TotalSeatsSold = async (req, res) => {
    try {
        const ownerId = req.owner.ownerId;
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
    
        const totalBooking = await Booking.aggregate([
          {
            $match: {
              showId: {
                $in: await Show.find({
                  theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') }
                }).distinct('_id')
              },
              createdAt: { $gte: lastWeek, $lt: today }
            }
          },
          {
            $lookup: {
              from: 'shows',
              localField: 'showId',
              foreignField: '_id',
              as: 'show'
            }
          },
          { $unwind: '$show' },
          {
            $lookup: {
              from: 'theaters',
              localField: 'show.theater',
              foreignField: '_id',
              as: 'theater'
            }
          },
          { $unwind: '$theater' },
          {
            $group: {
              _id: {
                theater: '$show.theater',
                theaterName: '$theater.name',
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              count: { $sum: { $size: '$seats' } }
            }
          },
          {
            $sort: {
              '_id.theater': 1,
              '_id.year': 1,
              '_id.month': 1,
              '_id.day': 1
            }
          }
        ]);
    
        res.json(totalBooking);
      } catch (error) {
        console.error('Error fetching total booking:', error.message);
        res.status(500).json({ error: 'Failed to fetch total booking' });
      }
    };






















// export const OwnerStat = async (req, res) => {
//     try {
//         const ownerId = req.owner.ownerId;
//         console.log(ownerId); 
//         const totalTheaters = await Theater.countDocuments({ owner: ownerId })
//         const totalMovies = await Movie.countDocuments();

//         const totalShows = await Show.countDocuments({ theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') } });

//         const bookingStats = await Booking.aggregate([
//             { 
//                 $match: { showId: { $in: await Show.find({ theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') } }).distinct('_id') } }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalBookings: { $sum: 1 },
//                     totalRevenue: { $sum: '$totalPrice' }
//                 }
//             }
//         ]);

//         const totalBookings = bookingStats[0]?.totalBookings || 0;
//         const totalRevenue = bookingStats[0]?.totalRevenue || 0;
//         const detailedBookings = await Booking.find({ showId: { $in: await Show.find({ theater: { $in: await Theater.find({ owner: ownerId }).distinct('_id') } }).distinct('_id') } })
//             .populate('showId')
//             .populate('userId');

//         res.json({
//             totalTheaters,
//             totalMovies,
//             totalShows,
//             totalBookings,
//             totalRevenue,
//             detailedBookings
//         });
//     } catch (error) {
//         console.error('Error fetching owner dashboard stats:', error.message);
//         res.status(500).json({ error: 'Failed to fetch dashboard stats' });
//     }
// }