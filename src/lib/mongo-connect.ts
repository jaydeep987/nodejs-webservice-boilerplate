import * as mongoose from 'mongoose';
import { EnvVars, config } from '~common/config';
import { Logger } from '~utils/logger';

const mongoConnect = () => mongoose.connect(
  config.get(EnvVars.MONGODB_URI),
  {
    useNewUrlParser: true,
  },
);

mongoose.connection.on('connected', () => {
  Logger.info({ message: 'mongoose is connected now!', prefix: 'mongoose' });
});

mongoose.connection.on('error', (e) => {
  Logger.error({ message: 'Some error in connecting mongoose', prefix: 'mongoose' });
});

const mongoDisconnect = async () => {
  await mongoose.connection.close(() => {
    Logger.info({ message: 'mongoose is closed and disconnected now!', prefix: 'mongoose' });
  });
};

// When app is closing, good to disconnect!
process.on('exit', async () => {
  await mongoDisconnect();
});

// When forcefully closing by ctrl^c, good to disconnect!
process.on('SIGINT', async () => {
  await mongoDisconnect();
  process.exit(0);
});

export {
  mongoConnect,
  mongoDisconnect,
};
