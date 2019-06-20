import MongoMemoryServer from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import { EnvVars, config } from '../src/common/config';

/** Virtual mongo server connection utility */
export class VirtualMongoServerConnector {
  /** Instance of MongoMemoryServer */
  private readonly mongoServer: MongoMemoryServer;
  /** Backup original mongo url from config */
  private originalMongoUrl: string;

  constructor() {
    this.mongoServer = new MongoMemoryServer();
  }

  /** Connects to virtual mongo server */
  async connect(): Promise<void> {
    const mongoUrl = await this.mongoServer.getConnectionString();

    this.originalMongoUrl = config.get(EnvVars.MONGODB_URI);
    config.set(EnvVars.MONGODB_URI, mongoUrl);
  }

  /** Disconnect from virtual mongo server */
  async disconnect(): Promise<void> {
    await this.cleanup();
    await this.mongoServer.stop();
    config.set(EnvVars.MONGODB_URI, this.originalMongoUrl);
  }

  /**
   * Delete all collections and indexes
   */
  // tslint:disable-next-line:no-any
  private readonly cleanup = async (): Promise<any[]> => {
    const collections = mongoose.connection.collections;

    return Promise.all(
      Object.values(collections)
        .map((collection) => collection.drop().catch((err) => {
          // ignore error
        })),
    );
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
