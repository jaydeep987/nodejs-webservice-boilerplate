import { Request, Response } from 'express';

/**
 * Base class for controllers to have same structure for all controller implementaions
 */
abstract class ControllerBase {

  /** Wrap given error with common response structure */
  protected wrapErrorResponse = (error: object | string, type: string): object => {
    const details: object = typeof error === 'string' ? { message: error } : error;

    return {
      status: 'error',
      type,
      errorDetails: details,
    };
  }

  // Some common methods
  /** put method to create new record in database */
  protected abstract async create(req: Request, res: Response): Promise<Response>;
  /** get method to get all records */
  protected abstract async getAll(req: Request, res: Response): Promise<Response>;
  /** get method to get by id */
  protected abstract async getById(req: Request, res: Response): Promise<Response>;
  /** get method to delete single record */
  protected abstract async deleteById(req: Request, res: Response): Promise<Response>;
}

export { ControllerBase };
