import BaseQueue, {IQueue} from './BaseQueue';

class DatabaseQueue extends BaseQueue {
  static dbInstance: DatabaseQueue;

  static getInstance(): DatabaseQueue {
    if (!this.dbInstance) {
      return new DatabaseQueue();
    }

    return this.dbInstance;
  }
}

export default DatabaseQueue;
