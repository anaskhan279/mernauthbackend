import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();
const port = process.env.PORT || 5000;
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser'

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
