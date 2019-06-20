import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import { errorHandler } from '~lib/error-handler';

import { mongoConnect } from './lib/mongo-connect';
import { routes } from './routes';

/**
 * App starter
 */
class App {
  /** Express instance to start with */
  private express: express.Application;

  /**
   * Creates and initializes app
   */
  async createApp(): Promise<express.Application> {
    this.express = express();
    await this.middleware();
    this.routes();
    this.configureErrorHandler();

    return this.express;
  }

  /**
   * Configures middlewares
   */
  private async middleware(): Promise<void> {
    await mongoConnect();
    this.express.use(compress());
    this.express.use(helmet());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  /**
   * Configures routes
   */
  private routes(): void {
    this.express.use('/', routes);
  }

  /**
   * Configures error handler
   */
  private configureErrorHandler(): void {
    this.express.use(errorHandler);
  }
}

export { App };
