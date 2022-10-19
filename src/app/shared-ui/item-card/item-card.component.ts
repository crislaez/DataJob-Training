import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { appColors, capitalizerText, getLastNumber, sliceText } from '@datajobs/shared/utils/functions';


@Component({
  selector: 'app-item-card',
  template:`
  <ion-card class="ion-activatable ripple-parent"
    [ngStyle]="{'background':appColors[getLastNumber(index)]}"
    [routerLink]="['/'+from+'/'+ item?.value?.codigo]">

    <ion-card-header>
      <ion-card-title>{{ sliceText(capitalizerText(title), 40) }}</ion-card-title>
    </ion-card-header>

    <ion-card-content class="displays-between margin-top">
      <div class="width-24">
        <ion-icon class="text-color" name="location-outline"></ion-icon>
      </div>
      <div class="width-74 text-color font-small displays-center">
        <div>
          <ng-container *ngIf="item?.value?.provincia as provincia">{{ provincia }}</ng-container>
          {{item?.value?.municipio}}
        </div>
      </div>

      <div class="width-24 margin-top text-color">
        <ion-icon class="text-color" name="calendar-number-outline"></ion-icon>
      </div>
      <div class="width-74 margin-top text-color font-small displays-center">
        <div>{{ date }}</div>
      </div>
    </ion-card-content>

    <ion-ripple-effect></ion-ripple-effect>
  </ion-card>
  `,
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {

  appColors = appColors;
  sliceText = sliceText;
  getLastNumber = getLastNumber;
  capitalizerText = capitalizerText;
  @Input() item: any;  //jobs | trainings
  @Input() index: number;
  @Input() from: string;


  constructor() { }


  get title(): string {
    const { value = null } = (this.item as any) || {};
    const { desEmpleo = null, titulo = null } = value || {};
    return desEmpleo ?? titulo;
  }

  get date(): string {
    const { value = null } = (this.item as any) || {};
    const { fecPub = null, f_inicio = null } = value || {};
    return fecPub ?? f_inicio;
  }


}
