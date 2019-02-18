import * as mongoose from 'mongoose';
import * as nconf from 'nconf';
import * as path from 'path';

export const EnvVars = {
  MONGO_URL: 'MONGO_URL',
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  SECRET: 'SECRET',
  LOG_FILE_NAME: 'LOG_FILE_NAME',
};

const config = nconf
  // 1. command-line arguments
  .argv()
  // 2. Envrionment vars
  .env([
    EnvVars.MONGO_URL,
    EnvVars.NODE_ENV,
    EnvVars.PORT,
    EnvVars.SECRET,
    EnvVars.LOG_FILE_NAME,
  ])
  // 3. Config file
  .file({
    file: path.join(__dirname, '..', 'config.json'),
  })
  // provide defaults for dev env or defaults
  .defaults({
    [EnvVars.PORT]: 3000,
    [EnvVars.NODE_ENV]: 'development',
    [EnvVars.MONGO_URL]: 'mongodb://localhost:27017/nodejs_service',
    [EnvVars.LOG_FILE_NAME]: 'logs/nodejs-service-log.log',
  });

checkConfig(EnvVars.MONGO_URL);
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

const mongoConnect = () => mongoose.connect(config.get(EnvVars.MONGO_URL), { useNewUrlParser: true });

export { config, mongoConnect };
