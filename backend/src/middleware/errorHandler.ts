import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import AppError from '../utils/errors.js';
import env from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong on the server';

  if (env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      status,
      error: err,
      message,
      stack: err.stack,
    });
  } else {
    // Production mode
    if (err.isOperational) {
      res.status(statusCode).json({
        status,
        message,
      });
    } else {
      console.error('❌ ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server',
      });
    }
  }
};

export default errorHandler;
