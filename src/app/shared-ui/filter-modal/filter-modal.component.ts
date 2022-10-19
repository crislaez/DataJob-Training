import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isNotEmptyObject, trackById } from '@datajobs/shared/utils/functions';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  template:`
  <ion-content class="modal-wrapper">

    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons class="text-color-light" slot="end">
          <ion-button class="ion-button-close" fill="clear" (click)="dismissModal()"><ion-icon name="close-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div class="displays-around height-100">

      <!-- <ng-container *ngIf="cities?.length > 0" >
        <ion-item class="item-select font-medium ">
          <ion-label>{{'COMMON.FILTER_BY_PROVINCE' | translate}}</ion-label>
          <ion-select (ionChange)="changeFilter($any($event), 'city')" [value]="inputFilter || ''" interface="action-sheet">
            <ion-select-option [value]="''">{{ 'COMMON.EVERYONE' | translate }}</ion-select-option>
            <ion-select-option *ngFor="let city of cities; trackBy: trackById" [value]="city">{{ city }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ng-container> -->

      <ng-container *ngIf="municipalities?.length > 0" >
        <ion-item class="item-select font-medium ">
          <ion-label>{{'COMMON.FILTER_BY_MUNICIPALITY' | translate}}</ion-label>
          <ion-select (ionChange)="changeFilter($any($event), 'municipality')" [value]="inputFilter || ''" interface="action-sheet">
            <ion-select-option [value]="''">{{ 'COMMON.EVERYONE' | translate }}</ion-select-option>
            <ion-select-option *ngFor="let municipality of municipalities; trackBy: trackById" [value]="municipality">{{ municipality }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ng-container>

    </div>

  </ion-content>
  `,
  styleUrls: ['./filter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterModalComponent {

  trackById = trackById;
  isNotEmptyObject = isNotEmptyObject;
  @Input() inputFilter: any
  // @Input() cities: string[];
  @Input() municipalities: string[];


  constructor(
    public modalController: ModalController
  ) { }


  changeFilter({detail: {value}}, filter): void{
    this.modalController.dismiss({
      // ...(this.inputFilter ?? {}),
      [filter]:value
    });
  }

  dismissModal() {
    this.modalController.dismiss(false);
  }


}
