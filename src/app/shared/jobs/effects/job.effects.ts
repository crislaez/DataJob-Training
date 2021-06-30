import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { JobActions } from '../actions';
import { JobService } from '../services/job.service';


@Injectable()
export class JobEffects {


  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.loadJobs),
      switchMap(() =>
        this._job.getJobs().pipe(
          map((jobs) => JobActions.saveJobs({jobs: jobs || []}) ),
          catchError((error) => {
            console.log(error)
            return [JobActions.saveJobs({jobs: []}) ]
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
