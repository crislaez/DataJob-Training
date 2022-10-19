import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { fromJob } from '@datajobs/shared/jobs';
import { capitalizerText, isNotEmptyObject } from '@datajobs/shared/utils/functions';
import { select, Store } from '@ngrx/store';
import { map, shareReplay, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-job.page',
  template: `
  <ion-content [fullscreen]="true" >

    <div class="empty-header components-dark-color">
      <div class="empty-div-50"></div>
      <h2 class="padding-top-10">{{ 'COMMON.DETAILS' | translate }}</h2>

      <div *ngIf="(job$ | async) as job" class="div-flex-start">
        <h3 class="padding-top-10">{{ capitalizerText(job?.desEmpleo) }}</h3>
        <ion-icon class="text-color" (click)="sharedContent(job?.url)" name="share-social-outline"></ion-icon>
      </div>
    </div>

    <div class="container components-dark-color">
      <ng-container *ngIf="(job$ | async) as job">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error';  else serverError">
              <ng-container *ngIf="isNotEmptyObject(job); else noData">

                <ion-card>
                  <ion-card-content class="displays-between text-color">
                    <div class="width-max margin-top">{{ job?.desPuesto }}</div>

                    <div class="width-half margin-top span-bold"><ion-icon name="location-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{ job?.provincia }} {{ job?.municipio }}</div>

                    <div class="width-half margin-top span-bold"><ion-icon name="calendar-number-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{ job?.fecPub }}</div>

                    <div class="width-max margin-top displays-center">
                      <ion-button [href]="job?.url">{{ 'COMMON.REGISTER_ON_WEB' | translate }}</ion-button>
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
  styleUrls: ['./job.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPage {

  capitalizerText = capitalizerText;
  isNotEmptyObject = isNotEmptyObject;

  status$ = this.store.pipe(select(fromJob.getStatus));
  job$ = this.route.params.pipe(
    switchMap(({idJob}) =>
      this.store.select(fromJob.getJob(idJob)).pipe(
        map((item: any) => (item?.value))
      )
    )
    ,shareReplay(1),
  );


  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }


  async sharedContent(url: string){
    await Share.share({
      title: 'Oferta laboral',
      text: 'Oferta laboral',
      url: url,
      dialogTitle: 'Oferta laboral',
    });
   }

}
