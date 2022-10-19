import { createReducer, on } from '@ngrx/store';
import * as TrainingActions from '../actions/training.actions';
import { Training } from '../models';
import { EntityStatus } from '@datajobs/shared/utils/functions';


export const trainingFeatureKey = 'training';

export interface State{
  trainings?: Training[];
  status?: EntityStatus;
  error: unknown;
}

const initialState: State = {
  trainings:[],
  status: EntityStatus.Initial,
  error:undefined
}

export const reducer = createReducer(
  initialState,
  on(TrainingActions.loadTrainings, (state) => ({...state, error: undefined, status: EntityStatus.Pending})),
  on(TrainingActions.saveTrainings, (state, { trainings, error, status }) => ({...state, trainings, error, status })),

);


