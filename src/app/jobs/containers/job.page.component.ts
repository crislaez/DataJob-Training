import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { fromJob } from '@datajobs/shared/jobs';
import { emptyObject } from '@datajobs/shared/shared/utils/utils';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-job.page',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">

      <ng-container *ngIf="(job$ | async) as job">
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error';  else serverError">
              <ng-container *ngIf="emptyObject(job); else noData">

                <div class="header" no-border>
                  <ion-back-button defaultHref="/jobs" class="text-second-color" [text]="''"></ion-back-button>
                  <h1 class="text-second-color">{{'COMMON.OFFERS_DETAILS' | translate}}</h1>
                  <div class="header-container-empty" (click)="sharedContent(job?.value?.url)"><ion-icon class="text-color" name="share-social-outline"></ion-icon></div>
                </div>

                <ion-card class="fade-in-card">
                  <ion-card-header>
                    <ion-card-title class="big-size">{{job?.value?.desEmpleo}}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content class="displays-between">
                    <div class="width-max margin-top">{{job?.value?.desPuesto}}</div>

                    <div class="width-half margin-top span-bold"><ion-icon class="text-color" name="location-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{job?.value?.provincia}} {{job?.value?.municipio}}</div>


                    <div class="width-half margin-top span-bold"><ion-icon class="text-color" name="calendar-number-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{job?.value?.fecPub}}</div>

                    <div class="width-max margin-top"><ion-button [href]="job?.value?.url">{{'COMMON.REGISTER_ON_WEB' | translate}}</ion-button></div>
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
          <ion-back-button defaultHref="/jobs" class="text-second-color" [text]="''"></ion-back-button>
          <h1 class="text-second-color">{{'COMMON.OFFERS_DETAILS' | translate}}</h1>
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
          <ion-back-button defaultHref="/jobs" class="text-second-color" [text]="''"></ion-back-button>
          <h1 class="text-second-color">{{'COMMON.OFFERS_DETAILS' | translate}}</h1>
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
  styleUrls: ['./job.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPage {

  emptyObject = emptyObject;
  status$ = this.store.pipe(select(fromJob.getStatus));
  job$: Observable<any> = this.route.params.pipe(
    switchMap(({idJob}) =>
      this.store.pipe(select(fromJob.getJob(idJob)))
    )
  );


  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // this.job$.subscribe(data => console.log(data))
  }


  async sharedContent(url: string){
    await Share.share({
      title: 'Oferta laboral',
      text: 'Oferta laboral',
      url: url,
      dialogTitle: 'Oferta laboral',
    });
   }

}
