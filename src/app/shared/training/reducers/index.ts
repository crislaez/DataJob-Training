import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTraining from './training.reducer';

export const trainingKey = 'training';

export interface State {
  [trainingKey]: fromTraining.State
}

export const reducer = fromTraining.reducer;

export const getTrainingState = createFeatureSelector<State, fromTraining.State>(trainingKey);


export const getTrainings = createSelector(
  getTrainingState,
  fromTraining.getTrainings
);

export const getPending = createSelector(
  getTrainingState,
  fromTraining.getPending
);

export const getTraining = (idTraining:string) => createSelector(
  getTrainings,
  (training) => {
    return (training || [])?.find(({value}) => value?.codigo === idTraining) || {}
  }
);

export const getTrainingsByMunicipality = (city:string) => createSelector(
  getTrainings,
  (training) => {
    return (training || [])?.filter(({value}) => value?.municipio === city || value?.municipio.includes(city)) || {}
  }
);


