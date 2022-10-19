import { EntityStatus } from '@datajobs/shared/utils/functions';
import { createAction, props } from '@ngrx/store';
import { Training } from '../models';


export const loadTrainings = createAction(
  '[Training] Load Trainings'
);

export const saveTrainings = createAction(
  '[Training] Save Trainings',
  props<{ trainings: Training[], error:unknown, status: EntityStatus }>()
);




