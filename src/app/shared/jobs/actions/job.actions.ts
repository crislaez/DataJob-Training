import { EntityStatus } from '@datajobs/shared/shared/utils/utils';
import { createAction, props } from '@ngrx/store';
import { Job } from '../models';


export const loadJobs = createAction(
  '[Job] Load Jobs'
);

export const saveJobs = createAction(
  '[Job] Save Jobs',
  props<{ jobs: Job[], error:unknown, status: EntityStatus }>()
);




