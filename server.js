import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectToMongoDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';




dotenv.config();
const PORT = process.env.PORT || 7895;
const app = express();
app.use(cors({
    
}));
app.use(express.json());
app.use(cookieParser());



//routes
app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);



app.use('/',(req,res)=>{
    res.send('server running successfully')
})

app.listen(PORT,()=>{
    connectToMongoDB()
    console.log('Server is running at http://localhost:' + PORT);
})