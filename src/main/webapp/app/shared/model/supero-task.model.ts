import { Moment } from 'moment';

export const enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE'
}

export interface ISuperoTask {
  id?: number;
  title?: string;
  description?: string;
  status?: TaskStatus;
  creationDate?: Moment;
  updateDate?: Moment;
  completionDate?: Moment;
  deletionDate?: Moment;
  deleted?: boolean;
}

export const defaultValue: Readonly<ISuperoTask> = {
  deleted: false
};
