import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromJob from '../reducers/job.reducer';

export const selectBibleState = createFeatureSelector<fromJob.State>(
  fromJob.jobFeatureKey
);



export const getJobs = createSelector(
  selectBibleState,
  (state) => state.jobs
);

export const getStatus = createSelector(
  selectBibleState,
  (state) => state.status
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

