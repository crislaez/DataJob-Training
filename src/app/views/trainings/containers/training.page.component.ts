import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { fromTraining } from '@datajobs/shared/training';
import { capitalizerText, isNotEmptyObject, trackById } from '@datajobs/shared/utils/functions';
import { select, Store } from '@ngrx/store';
import { map, shareReplay, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-training.page',
  template: `
  <ion-content [fullscreen]="true">

    <div class="empty-header components-dark-color">
      <div class="empty-div-50"></div>
      <h2 class="padding-top-10">{{ 'COMMON.DETAILS' | translate }}</h2>

      <div *ngIf="(training$ | async) as training" class="div-flex-start">
        <h3 class="padding-top-10">{{ capitalizerText(training?.titulo) }}</h3>
        <ion-icon class="text-color" (click)="sharedContent(training?.url)" name="share-social-outline"></ion-icon>
      </div>
    </div>

    <div class="container components-dark-color">
      <ng-container *ngIf="(training$ | async) as training">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error';  else serverError">

              <ng-container *ngIf="isNotEmptyObject(training); else noData">

                <ion-card>
                  <ion-card-content class="displays-between text-color">

                    <div class="width-half margin-top-30 span-bold">{{ 'COMMON.INIT_DATE' | translate }}:</div>
                    <div class="width-half margin-top-30">{{ training?.f_inicio }}</div>

                    <div class="width-half margin-top span-bold">{{ 'COMMON.END_DATE' | translate }}:</div>
                    <div class="width-half margin-top">{{ training?.f_fin }}</div>

                    <!-- <div class="width-half margin-top span-bold">{{ 'COMMON.ALT_DATE' | translate }}:</div>
                    <div class="width-half margin-top">{{ training?.f_alta }}</div> -->

                    <div class="width-half margin-top span-bold">{{ 'COMMON.TOTAl_HOURS' | translate }}:</div>
                    <div class="width-half margin-top">{{ training?.horas }}</div>

                    <ng-container *ngIf="!!training?.hora_ini_m && !!training?.hora_fin_m; else late">
                      <div class="width-half margin-top span-bold">{{ 'COMMON.HOUR' | translate }}:</div>
                      <div class="width-half margin-top">{{ training?.hora_ini_m }} - {{ training?.hora_fin_m }}</div>
                    </ng-container>

                    <ng-template #late>
                      <div class="width-half margin-top span-bold">{{ 'COMMON.HOUR' | translate }}:</div>
                      <div class="width-half margin-top">{{ training?.hora_ini_t }} - {{ training?.hora_fin_t }}</div>
                    </ng-template>

                    <div class="width-half margin-top span-bold"><ion-icon class="text-color" name="location-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{ training?.provincia }} {{ training?.municipio }}</div>

                    <!-- DIAS  -->
                    <h4 class="width-max margin-top">{{ 'COMMON.SEMANAL_HOURS' | translate }}</h4>
                    <div class="width-max displays-between margin-top-10">
                      <div class="width-12 span-bold" *ngFor="let day of daysKeys(); trackBy: trackById">{{ days[day] }}</div>
                      <div class="width-12" *ngFor="let day of daysKeys(); trackBy: trackById">
                        <ng-container *ngIf="training[day] === '1'; else no">{{ 'COMMON.YES' | translate }}</ng-container>
                        <ng-template #no>{{ 'COMMON.NO' | translate }}</ng-template>
                      </div>
                    </div>

                    <div class="width-max margin-top displays-center">
                      <ion-button [href]="training?.url">{{'COMMON.REGISTER_ON_WEB' | translate}}</ion-button>
                    </div>
                  </ion-card-content>

                </ion-card>
              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- IS ERROR -->
      <ng-template #serverError>
        <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'0vh'"></app-no-data>
      </ng-template>

      <!-- IS NO DATA  -->
      <ng-template #noData>
        <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'0vh'"></app-no-data>
      </ng-template>

      <!-- LOADER  -->
      <ng-template #loader>
        <app-spinner [top]="'60%'"></app-spinner>
      </ng-template>
    </div>
  </ion-content>
  `,
  styleUrls: ['./training.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPage {

  trackById = trackById;
  capitalizerText = capitalizerText;
  isNotEmptyObject = isNotEmptyObject;
  days: {[key: string]: string} = {lunes:'L',martes:'M',miercoles:'X',jueves:'J',viernes:'V',sabado:'S',domingo:'D'};

  status$ = this.store.pipe(select(fromTraining.getStatus));
  training$ = this.route.params.pipe(
    switchMap(({idTraining}) =>
      this.store.select(fromTraining.getTraining(idTraining)).pipe(
        map((item: any) => (item?.value))
      )
    )
    ,shareReplay(1)
    // ,tap(d => console.log(d))
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
