import * as express from 'express';
import * as http from 'http';
import { EnvVars, config } from '~common/config';

import { App } from './app';
import { Logger } from './utils/logger';

new App()
  .createApp()
  .then(initServer)
  .catch((error) => {
    Logger.error({ message: 'Some error while creating app', prefix: 'createApp' });
    throw error;
  });

const port = config.get(EnvVars.PORT);
const host = config.get(EnvVars.HOST);

/**
 * After mongo successfully connect, the promise get resolved
 * and we can start server
 */
function initServer(app: express.Application): http.Server {
  app.set('host', host);
  app.set('port', port);

  const httpServer = http.createServer(app);

  httpServer.listen(port, host);
  httpServer.on('error', onError);
  httpServer.on('listening', onListening(httpServer));
  httpServer.on('close', onClose);

  return httpServer;
}
/**
 * On server error
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      Logger.error({message: `${bind} requires elevated privilages`, prefix: 'Server'});
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error({message: `${bind} is already in use`, prefix: 'Server'});
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * When server is listening
 */
function onListening(httpServer: http.Server): () => void {
  return () => {
    const addr = httpServer.address();
    const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Address: ${addr.address} Port ${addr.port}`;
    Logger.info({message: `Listening on ${bind}`, prefix: 'Server'});
  };
}

/**
 * When server close
 */
function onClose(): void {
  Logger.info({message: `Server closed`, prefix: 'Server'});
}
