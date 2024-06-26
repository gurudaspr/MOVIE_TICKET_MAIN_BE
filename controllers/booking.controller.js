import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Booking from '../models/booking.model.js';
import Show from "../models/show.model.js";
import { parseISO, format } from 'date-fns';


export const createOrder = async (req, res) => {
    const { amount } = req.body;
    
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        res.status(200).send({ order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};
export const verifyPayment = async (req, res) => {
    try {
        const { showId,  seats, totalPrice, paymentId, orderId } = req.body;
        const userId = req.user.data;
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        hmac.update(`${orderId}|${paymentId}`);
        const generated_signature = hmac.digest('hex');
        if (generated_signature !== req.body.razorpay_signature) {
            console.log('Payment verification failed');
            return res.status(400).send({ success: false, message: 'Payment verification failed' });
        }
        const newBooking = new Booking({
            showId,
            userId,
            seats,
            totalPrice,
            status: 'booked'
        });
        await newBooking.save();

        const show = await Show.findById(showId);
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }
        await asyncForEach(seats, async (selectedSeatName) => {
            show.showSeating.forEach(row => {
                row.forEach(seat => {
                    if (seat && seat.seat === selectedSeatName) {
                        seat.status = 'booked';
                        console.log(`Seat ${seat.seat} status updated to 'booked'`);
                    }
                });
            });
        });
        await show.save();


        res.status(200).send({ success: true, message: 'Booking successful', booking: newBooking });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};




export const viewBookingbyUser = async (req, res) => {
    try {
        const userId = req.user.data;
        const bookings = await Booking.find({ userId }).populate({
          path: 'showId',
          populate: [
            { path: 'movieId', select: 'title' },
            { path: 'theater', select: 'name' }
          ]
        });
    
        const bookingDetails = bookings.map(booking => {
          try {
            const showDate = new Date(booking.showId.showDate);
            const formattedDate = format(showDate, "yyyy-MM-dd");
            const formattedTime = format(showDate, "h:mm a");
            return {
              id: booking._id,
              movieId : booking.showId.movieId._id,
              movieName: booking.showId.movieId.title,
              theaterName: booking.showId.theater.name,
              showDate: formattedDate,
              showTime: formattedTime,
              seats: booking.seats,
              price: booking.showId.price,
            };
          } catch (error) {
            console.error('Error processing booking:', error);
            return null;
          }
        });
        res.status(200).json(bookingDetails.filter(Boolean));
      } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
      }
    };



    //additional

export const totalBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({ totalBookings: bookings.length });
    } catch (error) {
        console.error('Error fetching total bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 



