import * as React from 'react';

import DatabaseQueue from '../../../core/queue/DatabaseQueue';

const queue = DatabaseQueue.getInstance();

const useDatabaseQueueHook = () => {
  const [triggerJob, setTriggerJob] = React.useState(-1);

  const triggerAddJobs = () => {
    setTriggerJob(() => new Date().getTime());
  };

  const processJobs = async () => {
    await queue?.processJobs();
  };

  React.useEffect(() => {
    // let timeout;
    // if (queue?.isExecutingJob) {
    //   timeout = setTimeout(() => {
    //     processJobs();
    //   }, 100);
    // } else {
    //   processJobs();
    // }
    // return () => {
    //   clearTimeout(timeout);
    // };
    // processJobs();
  }, []);

  return {
    queue,
    triggerAddJobs
  };
};

export default useDatabaseQueueHook;
