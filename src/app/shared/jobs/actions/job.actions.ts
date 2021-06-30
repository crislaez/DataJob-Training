import { createAction, props, union} from '@ngrx/store';
import { Job } from '../models';

export const loadJobs = createAction('[Job] Load Jobs');
export const saveJobs = createAction('[Job] Save Jobs', props<{jobs: Job[]}>());


const all = union({
  loadJobs,
  saveJobs
})

export type JobsActionsUnion = typeof all;


