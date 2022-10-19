import { Injectable } from '@angular/core';
import * as NotificationActions from '@datajobs/shared/notification/actions/notification.actions';
import { EntityStatus } from '@datajobs/shared/utils/functions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as JobActions from '../actions/job.actions';
import { JobService } from '../services/job.service';


@Injectable()
export class JobEffects {


  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.loadJobs),
      switchMap(() =>
        this._job.getJobs().pipe(
          map((jobs) => JobActions.saveJobs({jobs: jobs || [], error:undefined, status: EntityStatus.Loaded}) ),
          catchError((error) => {
            return of(
              JobActions.saveJobs({jobs: [],  error, status: EntityStatus.Error}),
              NotificationActions.notificationFailure({message:'COMMON.ERROR_LOAD_JOBS'})
            )
          })
        )
      )
    )
  );

  loadReposInit$ = createEffect(() =>
    of(JobActions.loadJobs())
  );


  constructor(private _job: JobService, private actions$: Actions){}
}
