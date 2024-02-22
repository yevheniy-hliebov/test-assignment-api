import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import HttpExceptionFilter from './middlewares/http-exception-filter.middleware';
import userRouter from './routes/user.route';
import tokenRouter from './routes/token.route';
import HttpException from './exceptions/http.exception';
dotenv.config();

export const usedTokens: Set<string> = new Set();

const app = express();
app.use(express.json());
// Enable CORS for all origins
app.use(cors());

// routes
app.get('/health', (req, res) => {
  res.send('API Worked');
});
app.use('/api/v1/images/users', express.static('storage/images/users/'));
app.use('/api/v1', userRouter);
app.use('/api/v1', tokenRouter);

// middleware exceptions
app.use((req, res, next) => {
  next(new HttpException(`Page not found`, 404));
});
app.use(HttpExceptionFilter);

const server = app.listen(process.env.PORT, () => {
  console.log('API Server up on port:', process.env.PORT);
})

process.on("unhandledRejection", (error: any) => {
  console.error(`An error occurred: ${error?.message}`);
  server.close(() => process.exit(1))
})
