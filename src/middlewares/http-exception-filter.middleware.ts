import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";

const HttpExceptionFilter = async (err: HttpException | Error, req: Request, res: Response, next: NextFunction) => {
  let status = 500;
  let message = 'Internal server error'
  let fails = null;
  if (err instanceof HttpException) {
    status = err.statusCode;
    message = err.message;
    fails = err.fails;
  }
  const exceptionResponse: any = {
    success: status >= 200 && status < 300,
    message: message,
  }
  if (fails) {
    exceptionResponse.fails = fails;
  }

  res.status(status).json(exceptionResponse);
}

export default HttpExceptionFilter;