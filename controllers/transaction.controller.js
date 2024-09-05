import axios from 'axios';

import dotenv from 'dotenv';
import payment from '../models/payment.model.js';
dotenv.config();

// export  const  Transactions = async (req, res) => { 
//     try {
//         const response = await axios.get('https://api.razorpay.com/v1/payments/', {
//             params: {
//                 count: 20,
//             },
//           auth: {
//             username: process.env.RAZORPAY_KEY_ID,
//             password: process.env.RAZORPAY_SECRET,
//           },
//         });
//         res.json(response.data.items);
//       } catch (error) {
//         console.error('Error fetching transactions:', error.message);
//         res.status(500).json({ error: 'Failed to fetch transactions' });
//       }
// };


// export const TotalTransactions = async (req, res) => {
//   try {
//     const response = await axios.get('https://api.razorpay.com/v1/payments/', {
//       params: {
//         count: 100,
//       },
//       auth: {
//         username: process.env.RAZORPAY_KEY_ID,
//         password: process.env.RAZORPAY_SECRET,
//       },
//     });
//     const payments = response.data.items;
//     const amount = payments.reduce((sum, payment) => sum + payment.amount, 0);
//     const totalAmount = amount / 100;;
//     res.json({ totalAmount: totalAmount });
//   } catch (error) {
//     console.error('Error fetching transactions:', error.message);
//     res.status(500).json({ error: 'Failed to fetch transactions' });
//   }
// }



export const Transactions = async (req, res) => {
  try {
    const totalPayments = await payment.find()
      .populate('userId', 'name email')
      .exec();

    res.status(200).json({ message: 'Transactions fetched successfully', totalPayments });
    console.log(totalPayments);

  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}


export const TotalTransactions = async (req, res) => {
  try {
    const totalPayments = await payment.find()
    const totalAmount = totalPayments.reduce((sum, payment) => sum + payment.amount, 0);
    res.json({ totalAmount: totalAmount });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}