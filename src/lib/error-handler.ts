import { NextFunction, Request, Response } from 'express';
import { ResponseStatus } from '~common/constants';

/**
 * Global error handler for express
 * Handles various errors like bad request or validation or authentication error
 */
export function errorHandler(err: string | Error, req: Request, res: Response, next: NextFunction): Response {
  // may be custom error
  if (typeof err === 'string') {
    return res
      .status(ResponseStatus.BAD_REQUEST)
      .json({ message: err });
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    return res
      .status(ResponseStatus.BAD_REQUEST)
      .json({ message: err.message });
  }

  // jwt authentication error
  if (err.name === 'UnauthorizedError') {
    return res
      .status(ResponseStatus.AUTH_FAILED)
      .json({ message: 'Invalid token' });
  }

  // default to 500 server error
  return res
    .status(ResponseStatus.INTERNAL_ERROR)
    .json({ message: err.message });
}
