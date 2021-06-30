import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <ion-content [fullscreen]="true">
    <div class="container components-color">


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
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  constructor() { }


}
