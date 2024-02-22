import dotenv from 'dotenv';
dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'Test key',
  expires_in: process.env.JWT_EXPIRES_IN || 3600, // in seconds
}

export default jwtConfig