import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { filter, map, shareReplay } from 'rxjs/operators';
import { NotificationModalComponent } from 'src/app/shared-ui/notification-modal/notification-modal.component';

@Component({
  selector: 'app-root',
  template:`
  <ion-app >
   <ion-header class="ion-no-border" >
     <ion-toolbar *ngIf="(currentSection$ | async) as currentSection">

      <ion-back-button
        *ngIf="!isNotShowBackButtons?.includes(currentSection)"
        class="text-color"
        slot="start"
        [defaultHref]="redirectTo(currentSection)"
        [text]="''">
      </ion-back-button>

       <ion-title
        class="text-color" >
        {{'COMMON.TITLE' | translate}}
        </ion-title>


       <ion-icon
          class="text-color"
          slot="end"
          name="ellipsis-horizontal-outline"
          (click)="presentModal()">
        </ion-icon>
     </ion-toolbar>
   </ion-header>

   <!-- RUTER  -->
   <ion-router-outlet id="main"></ion-router-outlet>

   <!-- TAB FOOTER  -->
   <ion-tabs >
     <ion-tab-bar [translucent]="true" slot="bottom" *ngIf="(currentSection$ | async) as currentSection">
       <ion-tab-button
        [ngClass]="{'active-class': currentSection?.includes('jobs')}"
        class="text-color"
        [routerLink]="['jobs']">
        <ion-icon name="bag-outline"></ion-icon>
        <ion-label>{{ 'COMMON.JOBS' | translate }}</ion-label>
       </ion-tab-button>

       <ion-tab-button
        [ngClass]="{'active-class': currentSection?.includes('trainings')}"
        class="text-color"
        [routerLink]="['trainings']">
        <ion-icon name="document-text-outline"></ion-icon>
        <ion-label>{{ 'COMMON.TRAININGS' | translate }}</ion-label>
       </ion-tab-button>

     </ion-tab-bar>
   </ion-tabs>

 </ion-app>
 `,
  styleUrls: ['./root.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  isNotShowBackButtons = ['jobs','trainings'];

  currentSection$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationStart),
    map((event: NavigationEnd) => {
      const { url = ''} = event || {};

      const [ , route = null, secondRouter = null] = url?.split('/') || [];
      if(secondRouter) return url
      return route || 'jobs';
    }),
    shareReplay(1)
  );


  constructor(
    private router: Router,
    private modalController: ModalController,
  ) { }


  redirectTo(currentSection:any): string{
    if(currentSection?.includes('jobs')) return '/jobs'
    if(currentSection?.includes('trainings')) return '/trainings'
    return '/jobs';
  }

  // OPEN FILTER MODAL
  async presentModal() {
    const modal = await this.modalController.create({
      component: NotificationModalComponent,
    });

    modal.present();
    await modal.onDidDismiss();
  }


}
