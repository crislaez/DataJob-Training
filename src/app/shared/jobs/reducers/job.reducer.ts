import { createReducer, on } from '@ngrx/store';
import { JobActions } from '../actions';
import { Job } from '../models';

// interface Status {
//   pending?: boolean;
//   error?: string;
// }

export interface State{
  jobs?: Job[];
  pending?: boolean;
  // page?: number;
  // total_pages?: number;
}

const initialState: State = {
  jobs:[],
  pending: false,
  // page: 1,
  // total_pages: 1,
}

const jobReducer = createReducer(
  initialState,
  on(JobActions.loadJobs, (state) => ({...state, pending: true})),
  on(JobActions.saveJobs, (state, { jobs }) => ({...state, jobs, pending: false })),

);

export function reducer(state: State | undefined, action: JobActions.JobsActionsUnion){
  return jobReducer(state, action);
}

export const getJobs = (state: State) => state?.jobs;
export const getPending = (state: State) => state?.pending;


