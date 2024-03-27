import DatabaseQueue from '../../../core/queue/DatabaseQueue';

const queue = DatabaseQueue.getInstance();

const useDatabaseQueueHook = () => {
  return {
    queue
  };
};

export default useDatabaseQueueHook;
