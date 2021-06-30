import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromJob, Job } from '@datajobs/shared/jobs';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { emptyObject } from '@datajobs/shared/shared/utils/utils';

@Component({
  selector: 'app-job.page',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

      <div class="header" no-border>
        <ion-back-button defaultHref="/jobs" class="text-second-color" [text]="''"></ion-back-button>
        <h1 class="text-second-color">{{'COMMON.OFFERS_DETAILS' | translate}}</h1>
        <div class="header-container-empty" ></div>
      </div>

      <ng-container *ngIf="(job$ | async) as job">
        <ng-container *ngIf="!(pending$ | async); else loader">
          <ng-container *ngIf="emptyObject(job); else noData">

            <ion-card class="ion-activatable ripple-parent fade-in-card">
              <ion-card-header>
                <ion-card-title class="big-size text-color capital-letter">{{job?.value?.desEmpleo}}</ion-card-title>
              </ion-card-header>

              <ion-card-content class="text-color displays-between">
                <div class="width-max margin-top">{{job?.value?.desPuesto}}</div>

                <div class="width-half margin-top"><ion-icon name="location-outline"></ion-icon></div>
                <div class="width-half margin-top">{{job?.value?.provincia}} {{job?.value?.municipio}}</div>


                <div class="width-half margin-top"><ion-icon name="calendar-number-outline"></ion-icon></div>
                <div class="width-half margin-top">{{job?.value?.fecPub}}</div>

                <div class="width-max margin-top"><a [href]="job?.value?.url">{{'COMMON.REGISTER_ON_WEB' | translate}}</a></div>
              </ion-card-content>

              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>

          </ng-container>
        </ng-container>
      </ng-container>


      <!-- IS NO DATA  -->
      <ng-template #noData>
        <div class="error-serve">
          <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
        </div>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <ion-spinner color="primary"></ion-spinner>
      </ng-template>
    </div>
  </ion-content>
  `,
  styleUrls: ['./job.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPage {

  emptyObject = emptyObject;
  pending$: Observable<boolean> = this.store.pipe(select(fromJob.getPending))
  job$: Observable<any> = this.route.params.pipe(
    switchMap(({idJob}) =>
      this.store.pipe(select(fromJob.getJob(idJob)))
    )
  );


  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // this.job$.subscribe(data => console.log(data))
  }

}