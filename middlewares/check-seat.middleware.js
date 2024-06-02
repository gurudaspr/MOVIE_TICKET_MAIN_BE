
import Show from '../models/show.model.js';

const checkSeatStatus = async (req, res, next) => {
    const { showId, selectedSeats } = req.body;
    try {
      const show = await Show.findById(showId);
  
      if (!show) {
        return res.status(404).send({ success: false, message: 'Show not found.' });
      }
  
      const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      };
  
      let seatReserved = false;
  
      await asyncForEach(selectedSeats, async (selectedSeatName) => {
        show.showSeating.forEach(row => {
          row.forEach(seat => {
            if (seat && seat.seat === selectedSeatName && (seat.status === 'reserved' || seat.status === 'booked')) {
                seatReserved = true;
              }
          });
        });
      });

      if (seatReserved) {
        return res.status(400).send({ success: false, message: 'One or more seats are already reserved.' });
      }
      await asyncForEach(selectedSeats, async (selectedSeatName) => {
        show.showSeating.forEach(row => {
          row.forEach(seat => {
            if (seat && seat.seat === selectedSeatName && seat.status === 'available') {
              seat.status = 'reserved';
              console.log(`Seat ${seat.seat} status updated to 'reserved'`);
            }
          });
        });
      });

       await show.save();
      setTimeout(async () => {

        const show = await  Show.findById(showId);
        await asyncForEach(selectedSeats, async (selectedSeatName) => {
          show.showSeating.forEach(row => {
            row.forEach(seat => {
              if (seat && seat.seat === selectedSeatName && seat.status === 'reserved') {
                seat.status = 'available';
                console.log(`Seat ${seat.seat} status changed back to 'available'`);
                
              }
            });
          });
        });
        await show.save();
      }, 1 * 60 * 1000);

      
  
      next();
    } catch (error) {
      console.error('Error checking seat status:', error);
      res.status(500).send({ success: false, message: 'Internal server error' });
    }
  };
  
  export default checkSeatStatus;