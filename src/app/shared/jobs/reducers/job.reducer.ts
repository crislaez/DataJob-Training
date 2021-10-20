import { EntityStatus } from '@datajobs/shared/shared/utils/utils';
import { createReducer, on } from '@ngrx/store';
import * as JobActions from '../actions/job.actions';
import { Job } from '../models';

export const jobFeatureKey = 'job';


export interface State{
  jobs?: Job[];
  status?: EntityStatus;
  error: unknown;
}

const initialState: State = {
  jobs:[],
  status: EntityStatus.Initial,
  error:undefined
}

export const reducer = createReducer(
  initialState,
  on(JobActions.loadJobs, (state) => ({...state, error: undefined, status: EntityStatus.Pending})),
  on(JobActions.saveJobs, (state, { jobs, error, status }) => ({...state, jobs, error, status })),

);

