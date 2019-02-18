import MongoMemoryServer from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import { EnvVars, config } from '../src/common/config';

/** Virtual mongo server connection utility */
export class VirtualMongoServerConnector {
  /** Instance of MongoMemoryServer */
  private mongoServer: MongoMemoryServer;
  /** Backup original mongo url from config */
  private originalMongoUrl: string;

  /** Connects to virtual mongo server */
  async connect(): Promise<void> {
    this.mongoServer = new MongoMemoryServer();
    const mongoUrl = await this.mongoServer.getConnectionString();

    this.originalMongoUrl = config.get(EnvVars.MONGO_URL);
    config.set(EnvVars.MONGO_URL, mongoUrl);
  }

  /** Disconnect from virtual mongo server */
  async disconnect(): Promise<void> {
    await this.clearData();
    this.mongoServer.stop(); // tslint:disable-line:no-floating-promises
    config.set(EnvVars.MONGO_URL, this.originalMongoUrl);
  }

  /** Clears all collection data from datastore */
  private readonly clearData = async (): Promise<void> => {
    let index: string;
    for (index in mongoose.connection.collections) {
      if (mongoose.connection.collections.hasOwnProperty(index)) {
        await mongoose.connection.collections[index].deleteMany({});
      }
    }
  }
}

/**
 * Picks given props from fromObj and returns new object
 */
export function pick(fromObj: {[key: string]: string}, props: string[] = []): {[key: string]: string} {
  return props.reduce((acc: {[key: string]: string}, prop: string) => {
    if (fromObj.hasOwnProperty(prop)) {
      acc[prop] = fromObj[prop];
    }

    return acc;
  },                  {});
}
