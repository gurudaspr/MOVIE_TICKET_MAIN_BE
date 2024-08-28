import mongoose from 'mongoose';


const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },    
    status: {
        type: String,
        required: true
    },
}, { timestamps: true });

const payment = mongoose.model('payment', paymentSchema);

export default payment;