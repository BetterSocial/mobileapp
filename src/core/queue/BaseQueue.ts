/* eslint-disable no-shadow */
export enum JobPriority {
  HIGH = 0,
  MEDIUM = 1,
  LOW = 2
}

export type IQueueJob = {
  task: () => Promise<any>;
  label?: string;
  callback?: (data) => void;
};

export type IHighPriorityQueueJobs = IQueueJob & {
  priority: JobPriority.HIGH | JobPriority.MEDIUM | JobPriority.LOW;
};

export type IQueue = {
  addJob: (job: IQueueJob) => void;
  addHighPriorityJob: (job: IHighPriorityQueueJobs) => void;
  processJobs: () => Promise<void>;
  getRemainingJobsCount: () => number;
};

class BaseQueue {
  static instance: BaseQueue;

  jobs: IQueueJob[] = [];

  highPriorityJobs: IHighPriorityQueueJobs[] = [];

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

  addHighPriorityJob(job: IHighPriorityQueueJobs) {
    this.highPriorityJobs.push(job);
    this.processJobs();
  }

  async processJobs() {
    if (this.isExecutingJob) return;

    console.log(
      'Remaining High Jobs:',
      this.highPriorityJobs.length,
      'Regular jobs:',
      this.jobs.length
    );
    this.isExecutingJob = true;
    if (this.highPriorityJobs.length > 0) {
      //   const job = this.highPriorityJobs.shift();
      this.highPriorityJobs.sort((a, b) => a.priority - b.priority);
      const job = this.highPriorityJobs.at(0);
      if (job) {
        console.log('Processing High Priority Job:', job.label, 'Priority:', job.priority);
        const response = await job.task();
        this.highPriorityJobs.shift();
        if (job?.callback) job.callback(response);
      }
    } else if (this.jobs.length > 0) {
      const job = this.jobs.at(0);
      if (job) {
        // console.log('Processing Job:', job.label);
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
