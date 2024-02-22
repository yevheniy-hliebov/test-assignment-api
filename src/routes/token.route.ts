import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import jwtConfig from '../configs/jwt.config';
import HttpException from "../exceptions/http.exception";
const router = express.Router();

router.get("/token", (req, res, next) => {
  try {
    const token = jwt.sign({ method: 'registration'}, jwtConfig.secret, { expiresIn: jwtConfig.expires_in + 's' })
    res.status(200).json({
      success: true,
      token
    })
  } catch (error) {
    next(new HttpException());
  }
});

export default router;