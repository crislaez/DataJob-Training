import { Component, ChangeDetectionStrategy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromTraining, TrainingActions } from '@datajobs/shared/training';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { gotToTop } from '@datajobs/shared/shared/utils/utils';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-trainings',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
      <div class="container components-color">

        <div class="header" no-border>
          <div class="header-container-empty" ></div>
          <h1 class="capital-letter text-second-color">{{'COMMON.TRAININGS_OFFERS' | translate}}</h1>
          <div class="header-container-empty" ></div>
        </div>

        <ng-container *ngIf="(trainings$ | async) as trainings">
          <ng-container *ngIf="!(pending$ |async); else loader">

            <ion-item>
              <ion-label>{{'COMMON.FILTER_BY_MUNICIPALITY' | translate}}</ion-label>
              <ion-select (ionChange)="changeFilter($any($event))" value="" interface="action-sheet">
                <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                <ion-select-option *ngFor="let municipality of municipalities" [value]="municipality">{{municipality}}</ion-select-option>
              </ion-select>
            </ion-item>

            <form (submit)="searchSubmit($event)">
              <ion-searchbar color="light" [placeholder]="'COMMON.SEARCH_BY_CITY' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
            </form>

            <ng-container *ngIf="trainings?.length > 0; else noData">

              <ion-virtual-scroll [items]="trainings" approxItemHeight="320px" class="margin-top-30">
                <ion-card class="ion-activatable ripple-parent fade-in-card" *virtualItem="let training; let i = index;" [routerLink]="['/trainings/'+ training?.value?.codigo]">
                  <ion-card-header>
                    <ion-card-title>{{training?.value?.titulo}}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content class="displays-between margin-top">
                    <div class="width-half span-bold"><ion-icon name="location-outline"></ion-icon></div>
                    <div class="width-half">{{training?.value?.municipio}}</div>

                    <div class="width-half margin-top span-bold"><ion-icon name="calendar-number-outline"></ion-icon></div>
                    <div class="width-half margin-top">{{training?.value?.f_inicio}}</div>
                  </ion-card-content>

                  <ion-ripple-effect></ion-ripple-effect>
                </ion-card>
              </ion-virtual-scroll>

            </ng-container>
          </ng-container>
        </ng-container>

         <!-- REFRESH -->
        <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>

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

       <!-- TO TOP BUTTON  -->
      <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styleUrls: ['./trainings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingsPage {

  gotToTop = gotToTop;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  municipalities: string[] = ['VITORIA-GASTEIZ', 'DONOSTIA/SAN SEBASTIÁN', 'BILBAO', 'ERRENTERIA', 'ARETXABALETA', 'MUSKIZ', 'IRUN', 'EIBAR', 'AZKOITIA', 'GALDAKAO', 'BARAKALDO', 'GALDAMES', 'ERANDIO', 'ZUMARRAGA', 'LAUDIO/LLODIO', 'URNIETA', 'MARKINA-XEMEIN', 'ARRASATE/MONDRAGON', 'PASAIA', 'PORTUGALETE', 'AMOREBIETA-ETXANO'];
  search = new FormControl('');
  showButton: boolean = false;

  searchValue$ = new EventEmitter();
  reload$ = new EventEmitter();
  selectedMunicipality$ = new EventEmitter();
  pending$: Observable<boolean> = this.store.pipe(select(fromTraining.getPending));

  trainings$: Observable<any> = combineLatest([
    this.selectedMunicipality$.pipe(startWith('')),
    this.searchValue$.pipe(startWith(''))
  ]).pipe(
    switchMap(([municipality, search]) => {
      if(!!municipality){
        return this.store.pipe(select(fromTraining.getTrainingsByMunicipality(municipality)),
          map(response => ([response, search]))
        )
      }
      else{
        return this.store.pipe(select(fromTraining.getTrainings),
          map(response => ([response, search]))
        )
      }
    }),
    map(([response, search]) => {
      if(!!search) return (response || []).filter(({value}) => value?.municipio === search.toUpperCase() || value?.municipio.includes(search.toUpperCase() ) )
      return response
    })
  );


  constructor(private route: ActivatedRoute, private router: Router, private store: Store, public platform: Platform) {
    // this.trainings$.subscribe(data => console.log(data))
  }


  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.store.dispatch(TrainingActions.loadTrainings());
      this.searchValue$.next('');
      event.target.complete();
    }, 500);
  }

  changeFilter({detail: {value}}): void{
    this.selectedMunicipality$.next(value)
  }

  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchValue$.next(this.search.value)
  }

  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchValue$.next('')
  }

}
