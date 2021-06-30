import { createAction, props, union} from '@ngrx/store';
import { Training } from '../models';

export const loadTrainings = createAction('[Training] Load Trainings');
export const saveTrainings = createAction('[Training] Save Trainings', props<{trainings: Training[]}>());


const all = union({
  loadTrainings,
  saveTrainings
})

export type TrainingsActionsUnion = typeof all;


