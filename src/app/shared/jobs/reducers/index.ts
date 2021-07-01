import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromJob from './job.reducer';

export const jobKey = 'job';

export interface State {
  [jobKey]: fromJob.State
}

export const reducer = fromJob.reducer;

export const getJobState = createFeatureSelector<State, fromJob.State>(jobKey);


export const getJobs = createSelector(
  getJobState,
  fromJob.getJobs
);

export const getPending = createSelector(
  getJobState,
  fromJob.getPending
);

export const getJob = (idJob:string) => createSelector(
  getJobs,
  (jobs) => {
    return (jobs || [])?.find(({value}) => value?.codigo === idJob) || {}
  }
);


export const getJobsByProvince = (city:string) => createSelector(
  getJobs,
  (jobs) => {
    return (jobs || [])?.filter(({value}) => value?.provincia === city || value?.provincia.includes(city)) || []
  }
);

