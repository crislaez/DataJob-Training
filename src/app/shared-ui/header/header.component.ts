import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  template: `
  <div class="empty-header components-dark-color">
    <div class="empty-div-50"></div>

    <h2 class="padding-top-10">{{ title | translate }}</h2>

    <div class="displays-center">
      <!-- FORM  -->
      <form (submit)="submitted($event)">
        <ion-searchbar  [placeholder]=" searchLabel | translate" [formControl]="search" (ionClear)="clearForm()"></ion-searchbar>
      </form>

      <!-- FILTER  -->
      <ion-button class="displays-center class-ion-button" (click)="presentModal.next()">
        <ion-icon name="options-outline"></ion-icon>
      </ion-button>
    </div>
  </div>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  search = new FormControl(null);
  @Input() title: string;
  @Input() searchLabel: string = 'COMMON.SEARCH_BY_CITY';
  @Input() set reset(val){
    this.search.reset()
  }
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() presentModal = new EventEmitter<any>();


  constructor() { }


  submitted(event): void{
    event.preventDefault();
    this.searchSubmit.next(this.search.value)
  }

  clearForm(): void{
    this.search.reset()
    this.clearSearch.next()
  }


}
