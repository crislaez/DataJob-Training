import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TrainingActions } from '../actions';
import { TrainingService } from '../services/training.service';


@Injectable()
export class TrainingEffects {


  loadTrainings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrainingActions.loadTrainings),
      switchMap(() =>
        this._training.getTrainings().pipe(
          map((trainings) => TrainingActions.saveTrainings({trainings: trainings || []}) ),
          catchError((error) => {
            console.log(error)
            return [TrainingActions.saveTrainings({trainings: []}) ]
          })
        )
      )
    )
  );

  loadReposInit$ = createEffect(() =>
    of(TrainingActions.loadTrainings())
  );


  constructor(private _training: TrainingService, private actions$: Actions){}
}
