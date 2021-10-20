import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTraining from '../reducers/training.reducer';

export const selectTrainingState = createFeatureSelector<fromTraining.State>(
  fromTraining.trainingFeatureKey
);


export const getTrainings = createSelector(
  selectTrainingState,
  (state) => state.trainings
);

export const getStatus = createSelector(
  selectTrainingState,
  (state) => state.status
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
