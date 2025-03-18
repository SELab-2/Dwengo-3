import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

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
    errorMessage = 'Validation Error';
  }

  // Send a more informative response in development
  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).send(errorMessage);
  } else {
    res.status(statusCode).json({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }
}
