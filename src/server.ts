import express from 'express';
import dotenv from 'dotenv';
import HttpExceptionFilter from './middlewares/http-exception-filter.middleware';
import userRouter from './routes/user.route';
dotenv.config();

const app = express();
app.use(express.json());

// routes
app.get('/health', (req, res) => {
  res.send('API Worked');
});
app.use('/users', userRouter);

// middleware exceptions
app.use(HttpExceptionFilter);

const server = app.listen(process.env.PORT, () => {
  console.log('API Server up on port:', process.env.PORT);
})

process.on("unhandledRejection", (error: any) => {
  console.error(`An error occurred: ${error?.message}`);
  server.close(() => process.exit(1))
})
