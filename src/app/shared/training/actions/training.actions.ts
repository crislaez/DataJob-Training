import { createAction, props, union} from '@ngrx/store';
import { Training } from '../models';
import { EntityStatus } from '@datajobs/shared/shared/utils/utils';


export const loadTrainings = createAction(
  '[Training] Load Trainings'
);

export const saveTrainings = createAction(
  '[Training] Save Trainings',
  props<{ trainings: Training[], error:unknown, status: EntityStatus }>()
);




