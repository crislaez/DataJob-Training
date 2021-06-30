import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromTraining, TrainingActions } from '@datajobs/shared/training';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trainings',
  template: `
    <ion-content [fullscreen]="true">
      <div class="container components-color">

        <div class="header" no-border>
          <div class="header-container-empty" ></div>
          <h1 class="capital-letter text-second-color">{{'COMMON.TRAININGS_OFFERS' | translate}}</h1>
          <div class="header-container-empty" ></div>
        </div>

        <ng-container *ngIf="(trainings$ | async) as trainings">
          <ng-container *ngIf="!(pending$ |async); else loader">
            <ng-container *ngIf="trainings?.length > 0; else noData">

              <ion-virtual-scroll [items]="trainings" approxItemHeight="320px">
                <ion-card class="ion-activatable ripple-parent fade-in-card" *virtualItem="let training; let i = index;" [routerLink]="['/trainings/'+ training?.value?.codigo]">
                  <ion-card-header>
                    <ion-card-title class="text-color capital-letter">{{training?.value?.titulo}}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content class="text-color displays-between margin-top">
                    <div class="width-half"><ion-icon name="location-outline"></ion-icon></div>
                    <div class="width-half">{{training?.value?.municipio}}</div>

                    <div class="width-half margin-top"><ion-icon name="calendar-number-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{training?.value?.f_inicio}}</div>
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
  styleUrls: ['./trainings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingsPage {

  pending$: Observable<boolean> = this.store.pipe(select(fromTraining.getPending));
  trainings$: Observable<any> = this.store.pipe(select(fromTraining.getTrainings));


  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // this.trainings$.subscribe(data => console.log(data))
   }


  // doRefresh(event) {
  //   setTimeout(() => {
  //     this.store.dispatch(TrainingActions.loadTrainings())
  //   }, 500);
  // }


}
