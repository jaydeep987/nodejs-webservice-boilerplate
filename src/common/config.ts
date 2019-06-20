import * as nconf from 'nconf';
import * as path from 'path';

export const EnvVars = {
  MONGODB_URI: 'MONGODB_URI',
  NODE_ENV: 'NODE_ENV',
  HOST: 'HOST',
  PORT: 'PORT',
  SECRET: 'SECRET',
  LOG_FILE_NAME: 'LOG_FILE_NAME',
  ORIGIN_ALLOWED: 'ORIGIN_ALLOWED',
};

const config = nconf
  // 1. command-line arguments
  .argv()
  // 2. Envrionment vars
  .env([
    EnvVars.MONGODB_URI,
    EnvVars.NODE_ENV,
    EnvVars.PORT,
    EnvVars.SECRET,
    EnvVars.LOG_FILE_NAME,
    EnvVars.HOST,
    EnvVars.ORIGIN_ALLOWED,
  ])
  // 3. Config file
  .file({
    file: path.join(__dirname, '..', 'config.json'),
  })
  // provide defaults for dev env or defaults
  .defaults({
    [EnvVars.HOST]: '0.0.0.0',
    [EnvVars.PORT]: 3200,
    [EnvVars.NODE_ENV]: 'development',
    [EnvVars.MONGODB_URI]: 'mongodb://localhost:27017/events',
    [EnvVars.LOG_FILE_NAME]: 'logs/nodejs-webservice-boilerplate.log',
    [EnvVars.ORIGIN_ALLOWED]: 'http://localhost:8080',
  });

checkConfig(EnvVars.MONGODB_URI);
checkConfig(EnvVars.NODE_ENV);
checkConfig(EnvVars.PORT);

/**
 * checks given setting config value is set or not
 */
function checkConfig(setting: string): void {
  if (!config.get(setting)) {
    throw new Error(`You must set ${setting} as environment var or in config.json`);
  }
}

export { config };
