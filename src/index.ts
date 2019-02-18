import * as http from 'http';

import { app } from './app';
import { Logger } from './utils/logger';

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`;
  Logger.info({message: `Listening on ${bind}`, prefix: 'Server'});
}
