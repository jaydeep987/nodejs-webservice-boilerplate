import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';

import { mongoConnect } from './common/config';
import { routes } from './routes';

/**
 * App starter
 */
class App {
  /** Express instance to start with */
  express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  /**
   * Configures middlewares
   */
  private middleware(): void {
    mongoConnect(); // tslint:disable-line:no-floating-promises
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
}

const app = new App().express;

export { app };
