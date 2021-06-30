import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { fromJob } from '@datajobs/shared/jobs';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Job, JobActions } from '@datajobs/shared/jobs';
import { startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-jobs',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

      <div class="header" no-border>
        <div class="header-container-empty" ></div>
        <h1 class="capital-letter text-second-color">{{'COMMON.JOBS_OFFERS' | translate}}</h1>
        <div class="header-container-empty" ></div>
      </div>

      <ng-container *ngIf="(jobs$ | async) as jobs">
        <ng-container *ngIf="!(pending$ | async); else loader">
          <ng-container *ngIf="jobs?.length > 0; else noData">

            <ion-virtual-scroll [items]="jobs" approxItemHeight="320px">
              <ion-card class="ion-activatable ripple-parent fade-in-card" *virtualItem="let job; let i = index;" [routerLink]="['/jobs/'+ job?.value?.codigo]">
                <ion-card-header>
                  <ion-card-title class="text-color capital-letter">{{job?.value?.desEmpleo}}</ion-card-title>
                </ion-card-header>

                <ion-card-content class="text-color displays-between margin-top">
                  <div class="width-half"><ion-icon name="location-outline"></ion-icon></div>
                  <div class="width-half">{{job?.value?.provincia}} {{job?.value?.municipio}}</div>

                  <div class="width-half margin-top"><ion-icon name="calendar-number-outline"></ion-icon></div>
                  <div class="width-half margin-top">{{job?.value?.fecPub}}</div>
                </ion-card-content>

                <ion-ripple-effect></ion-ripple-effect>
              </ion-card>
            </ion-virtual-scroll>

          </ng-container>
        </ng-container>
      </ng-container>

      <!-- REFRESH -->
      <!-- <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher> -->

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
  styleUrls: ['./jobs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobsPage {

  pending$: Observable<boolean> = this.store.pipe(select(fromJob.getPending));
  jobs$: Observable<Job[]> = this.store.pipe(select(fromJob.getJobs));


  constructor(private store: Store) {
    // this.jobs$.subscribe(data => console.log(data))
   }


  // doRefresh(event) {
  //   setTimeout(() => {
  //     this.store.dispatch(JobActions.loadJobs())
  //   }, 500);
  // }


}
