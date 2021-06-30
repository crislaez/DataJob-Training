import { createReducer, on } from '@ngrx/store';
import { TrainingActions } from '../actions';
import { Training } from '../models';

// interface Status {
//   pending?: boolean;
//   error?: string;
// }

export interface State{
  trainings?: Training[];
  pending?: boolean;
  // page?: number;
  // total_pages?: number;
}

const initialState: State = {
  trainings:[],
  pending: false,
  // page: 1,
  // total_pages: 1,
}

const trainingReducer = createReducer(
  initialState,
  on(TrainingActions.loadTrainings, (state) => ({...state, pending: true})),
  on(TrainingActions.saveTrainings, (state, { trainings }) => ({...state, trainings, pending: false })),

);

export function reducer(state: State | undefined, action: TrainingActions.TrainingsActionsUnion){
  return trainingReducer(state, action);
}

export const getTrainings = (state: State) => state?.trainings;
export const getPending = (state: State) => state?.pending;


