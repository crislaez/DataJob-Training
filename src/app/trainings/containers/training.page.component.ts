import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { emptyObject } from '@datajobs/shared/shared/utils/utils';
import { fromTraining } from '@datajobs/shared/training';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-training.page',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

      <ng-container *ngIf="(training$ | async) as training">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error';  else serverError">

              <ng-container *ngIf="emptyObject(training); else noData">

                <div class="header" no-border>
                  <ion-back-button defaultHref="/jobs" class="text-second-color" [text]="''"></ion-back-button>
                  <h1 class="text-second-color">{{'COMMON.TRAINING_DETAILS' | translate}}</h1>
                  <div class="header-container-empty" (click)="sharedContent(training?.value?.url)"><ion-icon class="text-color" name="share-social-outline"></ion-icon></div>
                </div>

                <ion-card class="fade-in-card">
                  <ion-card-header>
                    <ion-card-title class="big-size">{{training?.value?.titulo}}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content class="displays-between">

                    <div class="width-max margin-top span-bold"><ion-icon class="text-color" name="business-outline"></ion-icon></div>
                    <h3 class="width-max">{{training?.value?.centro}}</h3>

                    <div class="width-half margin-top-30 span-bold">{{'COMMON.INIT_DATE' | translate}}:</div>
                    <div class="width-half margin-top-30">{{training?.value?.f_inicio}}</div>

                    <div class="width-half margin-top span-bold">{{'COMMON.END_DATE' | translate}}:</div>
                    <div class="width-half margin-top">{{training?.value?.f_fin}}</div>

                    <div class="width-half margin-top span-bold">{{'COMMON.ALT_DATE' | translate}}:</div>
                    <div class="width-half margin-top">{{training?.value?.f_alta}}</div>

                    <div class="width-half margin-top span-bold">{{'COMMON.TOTAl_HOURS' | translate}}:</div>
                    <div class="width-half margin-top">{{training?.value?.horas}}</div>

                    <ng-container *ngIf="!!training?.value?.hora_ini_m && !!training?.value?.hora_fin_m; else late">
                      <div class="width-half margin-top span-bold">{{'COMMON.HOUR' | translate}}:</div>
                      <div class="width-half margin-top">{{training?.value?.hora_ini_m}} - {{training?.value?.hora_fin_m}}</div>
                    </ng-container>

                    <ng-template #late>
                      <div class="width-half margin-top span-bold">{{'COMMON.HOUR' | translate}}:</div>
                      <div class="width-half margin-top">{{training?.value?.hora_ini_t}} - {{training?.value?.hora_fin_t}}</div>
                    </ng-template>

                    <div class="width-half margin-top span-bold"><ion-icon class="text-color" name="location-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{training?.value?.provincia}} {{training?.value?.municipio}}</div>

                    <!-- DIAS  -->
                    <h4 class="width-max margin-top">{{'COMMON.SEMANAL_HOURS' | translate}}</h4>
                    <div class="width-max displays-between margin-top-10">
                      <div class="width-12 span-bold" *ngFor="let day of daysKeys()">{{days[day]}}</div>
                      <div class="width-12" *ngFor="let day of daysKeys()">
                        <ng-container *ngIf="training?.value[day] === '1'; else no">{{'COMMON.YES' | translate}}</ng-container>
                        <ng-template #no>{{'COMMON.NO' | translate}}</ng-template>
                      </div>
                    </div>

                    <div class="width-max margin-top"><ion-button [href]="training?.value?.url">{{'COMMON.REGISTER_ON_WEB' | translate}}</ion-button></div>
                  </ion-card-content>

                  <!-- <ion-ripple-effect></ion-ripple-effect> -->
                </ion-card>
              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- IS ERROR -->
      <ng-template #serverError>
        <div class="header" no-border>
          <ion-back-button defaultHref="/trainings" class="text-second-color" [text]="''"></ion-back-button>
          <h1 class="text-second-color">{{'COMMON.TRAINING_DETAILS' | translate}}</h1>
          <div class="header-container-empty" ></div>
        </div>
        <div class="error-serve">
          <div>
            <span><ion-icon class="text-second-color big-size" name="cloud-offline-outline"></ion-icon></span>
            <br>
            <span class="text-second-color">{{'COMMON.ERROR' | translate}}</span>
          </div>
        </div>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <div class="header" no-border>
          <ion-back-button defaultHref="/trainings" class="text-second-color" [text]="''"></ion-back-button>
          <h1 class="text-second-color">{{'COMMON.TRAINING_DETAILS' | translate}}</h1>
          <div class="header-container-empty" ></div>
        </div>
        <div class="error-serve">
          <span class="text-second-color">{{'COMMON.NORESULT' | translate}}</span>
        </div>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <ion-spinner class="loadingspinner"></ion-spinner>
      </ng-template>
    </div>
  </ion-content>
  `,
  styleUrls: ['./training.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPage {

  emptyObject = emptyObject;
  days: {[key: string]: string} = {lunes:'L',martes:'M',miercoles:'X',jueves:'J',viernes:'V',sabado:'S',domingo:'D'};

  status$ = this.store.pipe(select(fromTraining.getStatus));
  training$: Observable<any> = this.route.params.pipe(
    switchMap(({idTraining}) =>
      this.store.pipe(select(fromTraining.getTraining(idTraining)))
    )
  );


  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) { }


   daysKeys(): string[]{
     return Object.keys(this.days || []);
   }

   async sharedContent(url: string){
    await Share.share({
      title: 'Oferta formativa',
      text: 'Oferta formativa',
      url: url,
      dialogTitle: 'Oferta formativa',
    });
   }

}
