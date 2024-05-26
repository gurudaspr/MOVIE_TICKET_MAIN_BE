import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectToMongoDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import adminRoutes from './routes/admin.routes.js';






dotenv.config();
const PORT = process.env.PORT || 7895;
const app = express();
app.use(cors({ origin: 'https://movie-ticket-user-fe.vercel.app/', credentials: true
}));
app.use(express.json());
app.use(cookieParser());



//routes
app.use("/api", userRoutes);
app.use("/api", ownerRoutes);
app.use("/api", adminRoutes);



app.use('/',(req,res)=>{
    res.send('server running successfully')
})

app.listen(PORT,()=>{
    connectToMongoDB()
    console.log('Server is running at http://localhost:' + PORT);
})