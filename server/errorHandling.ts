import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { APIError } from './util/types/error.types';

export function errorHandling(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('[ERROR]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Determine the status code based on the error type
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (err instanceof ZodError) {
    statusCode = 400;
    errorMessage = err.errors[0].message;
  } else if (err instanceof APIError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }

  // Send a more informative response in development
  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      message: errorMessage,
    });
  } else {
    res.status(statusCode).json({
      message: errorMessage,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }
}
