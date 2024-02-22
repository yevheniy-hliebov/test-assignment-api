import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import jwt from 'jsonwebtoken';
import jwtConfig from '../configs/jwt.config';
import { usedTokens } from "../server";

// Middleware to check the token in the header
const checkTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Token");

  if (token && usedTokens.has(token)) {
    throw new HttpException('The token was used.', 401)
  }

  if (token) {
    usedTokens.add(token);
  }

  if (!token) {
    throw new HttpException('No token provided.', 401)
  }

  jwt.verify(token, jwtConfig.secret, (err) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        throw new HttpException('The token expired.', 401)
      } else {
        throw new HttpException('Invalid token', 401)
      }
    }
    next();
  });
};

export default checkTokenMiddleware;