import * as express from 'express';

/**
 * Base class for router to enforce common structure for all router implementations
 */
abstract class RouterBase {
  /** Holds router instance */
  protected readonly router = express.Router();

  /**
   * Constructs router which basically registers routes
   */
  constructor() {
    this.init();
    this.registerRoutes();
  }

  /** Gives router instance */
  getRouter(): express.Router {
    return this.router;
  }

  /** Initialize something. called before anything else */
  protected abstract init(): void;

  /** Register routes using controller */
  protected abstract registerRoutes(): void;
}

export { RouterBase };
