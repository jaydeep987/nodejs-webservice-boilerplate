import * as express from 'express';

import { EventRoutes } from './event';

const routes = express.Router();

routes.use('/event', new EventRoutes().getRouter());

export { routes };
