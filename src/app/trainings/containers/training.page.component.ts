import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { fromTraining } from '@datajobs/shared/training';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { emptyObject } from '@datajobs/shared/shared/utils/utils'


@Component({
  selector: 'app-training.page',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

     <div class="header" no-border>
        <ion-back-button defaultHref="/jobs" class="text-second-color" [text]="''"></ion-back-button>
        <h1 class="text-second-color">{{'COMMON.TRAINING_DETAILS' | translate}}</h1>
        <div class="header-container-empty" ></div>
      </div>

      <ng-container *ngIf="(training$ | async) as training">
        <ng-container *ngIf="!(pending$ | async); else loader">
          <ng-container *ngIf="emptyObject(training)">

            <ion-card class="ion-activatable ripple-parent fade-in-card">
              <ion-card-header>
                <ion-card-title class="big-size text-color capital-letter">{{training?.value?.titulo}}</ion-card-title>
              </ion-card-header>

              <ion-card-content class="text-color displays-between">
                <!-- <div class="width-half margin-top">{{'COMMON.CENTER' | translate}}:</div> -->
                <div class="width-max margin-top"><ion-icon name="business-outline"></ion-icon></div>
                <h3 class="width-max">{{training?.value?.centro}}</h3>

                <div class="width-half margin-top">{{'COMMON.INIT_DATE' | translate}}:</div>
                <div class="width-half margin-top">{{training?.value?.f_inicio}}</div>

                <div class="width-half margin-top">{{'COMMON.END_DATE' | translate}}:</div>
                <div class="width-half margin-top">{{training?.value?.f_fin}}</div>

                <div class="width-half margin-top">{{'COMMON.ALT_DATE' | translate}}:</div>
                <div class="width-half margin-top">{{training?.value?.f_alta}}</div>

                <div class="width-half margin-top">{{'COMMON.TOTAl_HOURS' | translate}}:</div>
                <div class="width-half margin-top">{{training?.value?.horas}}</div>

                <ng-container *ngIf="!!training?.value?.hora_ini_m && !!training?.value?.hora_fin_m; else late">
                  <div class="width-half margin-top">{{'COMMON.ENTRY_HOURS' | translate}}:</div>
                  <div class="width-half margin-top">{{training?.value?.hora_ini_m}}</div>

                  <div class="width-half margin-top">{{'COMMON.EXIT_HOURS' | translate}}:</div>
                  <div class="width-half margin-top">{{training?.value?.hora_fin_m}}</div>
                </ng-container>

                <ng-template #late>
                  <div class="width-half margin-top">{{'COMMON.ENTRY_HOURS' | translate}}:</div>
                  <div class="width-half margin-top">{{training?.value?.hora_ini_t}}</div>

                  <div class="width-half margin-top">{{'COMMON.EXIT_HOURS' | translate}}:</div>
                  <div class="width-half margin-top">{{training?.value?.hora_fin_t}}</div>
                </ng-template>

                <div class="width-half margin-top"><ion-icon name="location-outline"></ion-icon></div>
                <div class="width-half margin-top">{{training?.value?.provincia}} {{training?.value?.municipio}}</div>

                <div class="width-max margin-top"><a [href]="training?.value?.url">{{'COMMON.REGISTER_ON_WEB' | translate}}</a></div>
              </ion-card-content>

              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <div class="header" no-border>
          <ion-back-button defaultHref="/search" class="text-second-color" [text]="''"></ion-back-button>
          <h1 class="capital-letter">{{'COMMON.NO_SUBSCRIBERS_TITLE' | translate}}</h1>
          <div class="header-container-empty" ></div>
        </div>
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
  styleUrls: ['./training.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPage {

  emptyObject = emptyObject;
  pending$: Observable<boolean> = this.store.pipe(select(fromTraining.getPending));
  training$: Observable<any> = this.route.params.pipe(
    switchMap(({idTraining}) =>
      this.store.pipe(select(fromTraining.getTraining(idTraining)))
    )
  );

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // this.training$.subscribe(data => console.log(data))
   }


}
