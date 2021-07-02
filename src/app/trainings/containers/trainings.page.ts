import { Component, ChangeDetectionStrategy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromTraining, TrainingActions } from '@datajobs/shared/training';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { gotToTop, trackById } from '@datajobs/shared/shared/utils/utils';
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
          <h1 class="text-second-color">{{'COMMON.TRAININGS_OFFERS' | translate}}</h1>
          <div class="header-container-empty" ></div>
        </div>

        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="!(pending$ |async); else loader">

            <ion-item class="fade-in-card">
              <ion-label>{{'COMMON.FILTER_BY_MUNICIPALITY' | translate}}</ion-label>
              <ion-select (ionChange)="changeFilter($any($event))" value="" interface="action-sheet">
                <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
                <ion-select-option *ngFor="let municipality of municipalities" [value]="municipality">{{municipality}}</ion-select-option>
              </ion-select>
            </ion-item>

            <form (submit)="searchSubmit($event)" class="fade-in-card">
              <ion-searchbar color="light" [placeholder]="'COMMON.SEARCH_BY_CITY' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
            </form>

            <ng-container *ngIf="info?.trainings?.length > 0; else noData">

              <ion-card class="ion-activatable ripple-parent fade-in-card" *ngFor="let training of info?.trainings; trackBy: trackById" [routerLink]="['/trainings/'+ training?.value?.codigo]">
                <ion-card-header>
                  <ion-card-title>{{training?.value?.titulo}}</ion-card-title>
                </ion-card-header>

                <ion-card-content class="displays-between margin-top">
                  <div class="width-half span-bold"><ion-icon class="text-color" name="location-outline"></ion-icon></div>
                  <div class="width-half">{{training?.value?.municipio}}</div>

                  <div class="width-half margin-top span-bold"><ion-icon class="text-color" name="calendar-number-outline"></ion-icon></div>
                  <div class="width-half margin-top">{{training?.value?.f_inicio}}</div>
                </ion-card-content>

                <ion-ripple-effect></ion-ripple-effect>
              </ion-card>

               <!-- INFINITE SCROLL  -->
              <ng-container *ngIf="info?.total as total">
                <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                  <ion-infinite-scroll-content loadingSpinner="crescent" color="primary">
                  </ion-infinite-scroll-content>
                </ion-infinite-scroll>
              </ng-container>

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
          <ion-spinner color="light"></ion-spinner>
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
  trackById = trackById;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  municipalities: string[] = ['VITORIA-GASTEIZ', 'DONOSTIA/SAN SEBASTIÁN', 'BILBAO', 'ERRENTERIA', 'ARETXABALETA', 'MUSKIZ', 'IRUN', 'EIBAR', 'AZKOITIA', 'GALDAKAO', 'BARAKALDO', 'GALDAMES', 'ERANDIO', 'ZUMARRAGA', 'LAUDIO/LLODIO', 'URNIETA', 'MARKINA-XEMEIN', 'ARRASATE/MONDRAGON', 'PASAIA', 'PORTUGALETE', 'AMOREBIETA-ETXANO'];
  search = new FormControl('');
  showButton: boolean = false;
  perPage: number = 15;

  infiniteScroll$ = new EventEmitter();
  searchValue$ = new EventEmitter();
  reload$ = new EventEmitter();
  selectedMunicipality$ = new EventEmitter();
  pending$: Observable<boolean> = this.store.pipe(select(fromTraining.getPending));

  info$: Observable<any> = combineLatest([
    this.selectedMunicipality$.pipe(startWith('')),
    this.searchValue$.pipe(startWith('')),
    this.infiniteScroll$.pipe(startWith(15))
  ]).pipe(
    switchMap(([municipality, search, perPage]) => {
      if(!!municipality){
        return this.store.pipe(select(fromTraining.getTrainingsByMunicipality(municipality)),
          map(response => ([response, search, perPage]))
        )
      }
      else{
        return this.store.pipe(select(fromTraining.getTrainings),
          map(response => ([response, search, perPage]))
        )
      }
    }),
    map(([response, search, perPage]) => {
      // console.log(perPage)
      // console.log(response?.length)
      if(!!search){
        return {
          trainings: ((response || []).filter(({value}) => value?.municipio === search.toUpperCase() || value?.municipio.includes(search.toUpperCase())) || []).slice(0, perPage),
          total:response?.length
        }
      }
      return {
        trainings: (response || []).slice(0, perPage),
        total:response?.length
      }
    })
  );


  constructor(private route: ActivatedRoute, private router: Router, private store: Store, public platform: Platform) {
    // this.info$.subscribe(data => console.log(data?.trainings))
  }


  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchValue$.next(this.search.value);
    this.clearAll();
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.searchValue$.next('');
    this.clearAll();
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      this.perPage = this.perPage + 15;
      if(this.perPage >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }
      this.infiniteScroll$.next(this.perPage)
      event.target.complete();
    }, 500);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.store.dispatch(TrainingActions.loadTrainings());
      this.searchValue$.next('');
      this.selectedMunicipality$.next('');
      this.clearAll();

      event.target.complete();
    }, 500);
  }

  // FILTER
  changeFilter({detail: {value}}): void{
    this.selectedMunicipality$.next(value);
    this.clearAll();
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }

  clearAll(): void{
    this.perPage = 15
    this.infiniteScroll$.next(this.perPage)
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false
  }

}
