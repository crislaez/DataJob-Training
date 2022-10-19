import { Injectable } from '@angular/core';
import * as NotificationActions from '@datajobs/shared/notification/actions/notification.actions';
import { EntityStatus } from '@datajobs/shared/utils/functions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TrainingActions from '../actions/training.actions';
import { TrainingService } from '../services/training.service';


@Injectable()
export class TrainingEffects {


  loadTrainings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrainingActions.loadTrainings),
      switchMap(() =>
        this._training.getTrainings().pipe(
          map((trainings) => TrainingActions.saveTrainings({trainings: trainings || [], error:undefined, status: EntityStatus.Loaded}) ),
          catchError((error) => {
            return of(
              TrainingActions.saveTrainings({trainings: [], error, status: EntityStatus.Error}),
              NotificationActions.notificationFailure({message:'COMMON.ERROR_LOAD_TRAININGS'})
            )
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
