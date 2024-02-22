import * as fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
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

// swagger api documentation
const existAPISwaggerJson = fs.existsSync('./api-swagger.json')
if (existAPISwaggerJson) {
  const rawData = fs.readFileSync('./api-swagger.json', 'utf-8');

  const jsonData = JSON.parse(rawData.replace(/\$\{[A-Z_]+\}/, (match: string) => {
    const env = match.replace(/\${([^}]+)}/, '$1');
    return process.env[env] || '';
  }));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(jsonData));
}

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
