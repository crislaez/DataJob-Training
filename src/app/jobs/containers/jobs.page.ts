import { Component, ChangeDetectionStrategy, EventEmitter, ViewChild } from '@angular/core';
import { fromJob } from '@datajobs/shared/jobs';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { Job, JobActions } from '@datajobs/shared/jobs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { gotToTop, trackById } from '@datajobs/shared/shared/utils/utils';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-jobs',
  template: `
  <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">
    <div class="container components-color">

      <div class="header" no-border>
        <div class="header-container-empty" ></div>
        <h1 class="text-second-color">{{'COMMON.JOBS_OFFERS' | translate}}</h1>
        <div class="header-container-empty"></div>
      </div>


      <ng-container *ngIf="(info$ | async) as info">
        <ng-container *ngIf="!(pending$ | async); else loader">

          <ion-item class="fade-in-card">
            <ion-label>{{'COMMON.FILTER_BY_PROVINCE' | translate}}</ion-label>
            <ion-select (ionChange)="changeFilter($any($event))" value="" interface="action-sheet">
              <ion-select-option value="">{{'COMMON.EVERYONE' | translate}}</ion-select-option>
              <ion-select-option *ngFor="let city of cities" [value]="city">{{city}}</ion-select-option>
            </ion-select>
          </ion-item>

          <form (submit)="searchSubmit($event)" class="fade-in-card">
            <ion-searchbar color="light" [placeholder]="'COMMON.SEARCH_BY_CITY' | translate" [formControl]="search" (ionClear)="clearSearch($event)"></ion-searchbar>
          </form>

          <ng-container *ngIf="info?.jobs?.length > 0; else noData">

            <ion-card class="ion-activatable ripple-parent fade-in-card" *ngFor="let job of info?.jobs; trackBy: trackById" [routerLink]="['/jobs/'+ job?.value?.codigo]">
              <ion-card-header>
                <ion-card-title>{{job?.value?.desEmpleo}}</ion-card-title>
              </ion-card-header>

              <ion-card-content class="displays-between margin-top">
                <div class="width-half"><ion-icon class="text-color" name="location-outline"></ion-icon></div>
                <div class="width-half">{{job?.value?.provincia}} {{job?.value?.municipio}}</div>

                <div class="width-half margin-top"><ion-icon class="text-color" name="calendar-number-outline"></ion-icon></div>
                <div class="width-half margin-top">{{job?.value?.fecPub}}</div>
              </ion-card-content>

              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>

            <!-- INFINITE SCROLL  -->
            <ng-container *ngIf="info?.total as total">
              <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event, total)">
                <ion-infinite-scroll-content class="loadingspinner">
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
        <ion-spinner class="loadingspinner"></ion-spinner>
      </ng-template>
    </div>

    <!-- TO TOP BUTTON  -->
    <ion-fab *ngIf="showButton" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button class="color-button color-button-text" (click)="gotToTop(content)"> <ion-icon name="arrow-up-circle-outline"></ion-icon></ion-fab-button>
    </ion-fab>
  </ion-content>
  `,
  styleUrls: ['./jobs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobsPage {

  gotToTop = gotToTop;
  trackById = trackById;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  cities: string[] = ['GIPUZKOA', 'BIZKAIA', 'ARABA/ÁLAVA'];
  search = new FormControl('');
  showButton: boolean = false;
  perPage: number = 15;

  infiniteScroll$ = new EventEmitter();
  searchValue$ = new EventEmitter();
  reload$ = new EventEmitter();
  selectedCity$ = new EventEmitter();
  pending$: Observable<boolean> = this.store.pipe(select(fromJob.getPending));

  info$: Observable<any> = combineLatest([
    this.selectedCity$.pipe(startWith('')),
    this.searchValue$.pipe(startWith('')),
    this.infiniteScroll$.pipe(startWith(15))
  ]).pipe(
    switchMap(([city, search, perPage]) =>{
      if(!!city){
        return this.store.pipe(select(fromJob.getJobsByProvince(city)),
          map(response => ([response, search, perPage]))
        )
      }
      else{
        return this.store.pipe(select(fromJob.getJobs),
          map(response => ([response, search, perPage]))
        )
      }
    }),
    map(([response, search, perPage]) => {
      // console.log(perPage)
      // console.log(response?.length)
      if(!!search){
        return {
          jobs: ((response || []).filter(({value}) => value?.municipio === search.toUpperCase() || value?.municipio.includes(search.toUpperCase())) ||[])?.slice(0, perPage),
          total:response?.length
        }
      }
      return {
        jobs:(response || []).slice(0, perPage),
        total:response?.length
      }
    })
  );


  constructor(private store: Store, public platform: Platform) {
    // this.info$.subscribe(data => console.log(data))
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
      this.store.dispatch(JobActions.loadJobs());
      this.searchValue$.next('');
      this.selectedCity$.next('');
      this.clearAll();

      event.target.complete();
    }, 500);
  }

  // FILTER
  changeFilter({detail: {value}}): void{
    this.selectedCity$.next(value)
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
