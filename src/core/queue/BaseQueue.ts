import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../utils/log/FeatureLog';
import {DatabaseOperationLabel} from './DatabaseQueue';

/* eslint-disable no-shadow */
export enum QueueJobPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

type allEnum = DatabaseOperationLabel;

export type IQueueJob = {
  task: () => Promise<any>;
  label?: string;
  operationLabel: allEnum;
  id: string;
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

  timekeeper = {};

  static getInstance(): BaseQueue {
    if (!this.instance) {
      return new BaseQueue();
    }

    return this.instance;
  }

  addJob(job: IQueueJob) {
    if (!job) throw new Error('Job is required');
    if (!job?.task) throw new Error('Task is required');
    if (!job?.operationLabel) throw new Error('Database Operation Label is required');
    if (!job?.id) throw new Error('id is required');

    try {
      this.jobs.push({
        ...job,
        label: `${job.operationLabel}-${job.id}`
      });
      this.processJobs();
    } catch (e) {
      featLog('error on addJob', e);
    }
  }

  addPriorityJob(job: IPriorityQueueJob) {
    if (!job) throw new Error('Job is required');
    if (!job?.task) throw new Error('Task is required');
    if (!job?.priority) throw new Error('Priority is required');

    job.label = `${job.operationLabel}-${job.id}`;

    /**
     * Timekeeping block (START)
     *
     * This block is to optimize priority job addition to the queue
     * 1. Find job that has the same label on the timekeeper hash map. If no job with the same label set default lastAddedTime to 0;
     * 2. If there are jobs with the same label, check its time difference with the timekeeper.
     * 3. If the difference is more than 50ms, add it to the queue.
     * 4. forceAddToQueue parameter ignores all above requirement.
     * 5. Set timekeeper for job with current timestamp.
     */
    const currentTime = Date.now().valueOf();
    const lastAddedTime = this.timekeeper?.[job.label] || 0;
    const diff = currentTime - lastAddedTime;

    const shouldQueueAdded = lastAddedTime === 0 || diff > 50 || job.forceAddToQueue;

    if (shouldQueueAdded) {
      this.timekeeper[job.label] = currentTime;
      this.highPriorityJobs.push({...job, createdAt: currentTime});
    }

    /**
     * Timekeeping block (END)
     */

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
      featLog('No more jobs to process');
      this.timekeeper = {};
    }
  }

  getRemainingJobsCount() {
    const jobsCount = this.jobs.length + this.highPriorityJobs.length;
    return jobsCount;
  }
}

export default BaseQueue;
