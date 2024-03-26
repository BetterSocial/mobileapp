import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../utils/log/FeatureLog';

/* eslint-disable no-shadow */
export enum QueueJobPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

export type IQueueJob = {
  task: () => Promise<any>;
  label?: string;
  callback?: (data) => void;
};

export type IPriorityQueueJob = IQueueJob & {
  priority: QueueJobPriority.HIGH | QueueJobPriority.MEDIUM | QueueJobPriority.LOW;
  createdAt?: number;
  forceAddToQueue?: boolean;
};

export type IQueue = {
  addJob: (job: IQueueJob) => void;
  addPriorityJob: (job: IPriorityQueueJob) => void;
  processJobs: () => Promise<void>;
  getRemainingJobsCount: () => number;
};

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.DBQueue);

class BaseQueue {
  static instance: BaseQueue;

  jobs: IQueueJob[] = [];

  highPriorityJobs: IPriorityQueueJob[] = [];

  isExecutingJob = false;

  static getInstance(): BaseQueue {
    if (!this.instance) {
      return new BaseQueue();
    }

    return this.instance;
  }

  addJob(job: IQueueJob) {
    if (!job) throw new Error('Job is required');
    if (!job?.task) throw new Error('Task is required');

    try {
      this.jobs.push(job);
      this.processJobs();
    } catch (e) {
      console.log('error on addJob', e);
    }
  }

  addPriorityJob(job: IPriorityQueueJob) {
    if (!job) throw new Error('Job is required');
    if (!job?.task) throw new Error('Task is required');
    if (!job?.priority) throw new Error('Priority is required');

    const sameQueueIndex = this.highPriorityJobs.findIndex((current) => {
      return current?.label === job.label;
    });

    if (sameQueueIndex === -1 || job?.forceAddToQueue) {
      this.highPriorityJobs.push({...job, createdAt: Date.now().valueOf()});
    }

    this.processJobs();
  }

  async processJobs() {
    if (this.isExecutingJob) return;

    featLog(
      'Remaining High Jobs:',
      this.highPriorityJobs.length,
      'Regular jobs:',
      this.jobs.length
    );

    this.isExecutingJob = true;
    if (this.highPriorityJobs.length > 0) {
      this.highPriorityJobs.sort(
        (a, b) => a.priority - b.priority || (a?.createdAt || 0) - (b?.createdAt || 0)
      );
      const job = this.highPriorityJobs.at(0);
      if (job) {
        featLog('Processing High Priority Job:', job.label, 'Priority:', job.priority);
        const response = await job.task();
        this.highPriorityJobs.shift();
        if (job?.callback) job.callback(response);
      }
    } else if (this.jobs.length > 0) {
      const job = this.jobs.at(0);
      if (job) {
        featLog('Regular jobs:', job.label);
        const response = await job.task();
        this.jobs.shift();
        if (job?.callback) job.callback(response);
      }
    }

    this.isExecutingJob = false;

    if (this.highPriorityJobs.length > 0 || this.jobs.length > 0) {
      this.processJobs();
    } else {
      console.log('No more jobs to process');
    }
  }

  getRemainingJobsCount() {
    const jobsCount = this.jobs.length + this.highPriorityJobs.length;
    return jobsCount;
  }
}

export default BaseQueue;
