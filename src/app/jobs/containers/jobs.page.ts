import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { fromJob } from '@datajobs/shared/jobs';
import { gotToTop, trackById } from '@datajobs/shared/shared/utils/utils';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';


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
        <ng-container *ngIf="(status$ | async) as status">
          <ng-container *ngIf="status !== 'pending'; else loader">
            <ng-container *ngIf="status !== 'error';  else serverError">

              <ion-item class="fade-in-card item-select">
                <ion-label>{{'COMMON.FILTER_BY_PROVINCE' | translate}}</ion-label>
                <ion-select (ionChange)="changeFilter($any($event))" [value]="statusComponent?.city" interface="action-sheet">
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
                    <ion-infinite-scroll-content color="primary" class="loadingspinner">
                    </ion-infinite-scroll-content>
                  </ion-infinite-scroll>
                </ng-container>

              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
      </ng-container>

      <!-- REFRESH -->
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- IS ERROR -->
      <ng-template #serverError>
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
  // perPage: number = 15;
  statusComponent = {
    city:'',
    search:'',
    perPage:15,
  };

  infiniteScroll$ = new EventEmitter<{perPage: number, city: string, search: string}>();
  searchValue$ = new EventEmitter();
  reload$ = new EventEmitter();
  selectedCity$ = new EventEmitter();
  status$ = this.store.pipe(select(fromJob.getStatus));

  info$: Observable<any> = this.infiniteScroll$.pipe(
    startWith(this.statusComponent),
    switchMap( ({city, search, perPage}) => {
      return this.store.select(fromJob.getJobs).pipe(
        map(trainings => {
          let result = trainings;

          if(!!city){
            result = (result || [])?.filter(({value}) => value?.provincia === city?.toUpperCase() || value?.provincia?.includes(city?.toUpperCase()) )
          }

          if(!!search){
            result = (result || [])?.filter(({value}) => value?.municipio === search?.toUpperCase() || value?.municipio?.includes(search?.toUpperCase()) || value?.provincia === search?.toUpperCase() || value?.provincia?.includes(search?.toUpperCase()))
          }

          return {
            jobs: result.slice(0, perPage),
            total: result?.length
          }
        })
      )
    })
  );


  constructor(
    private store: Store,
    public platform: Platform
  ) {  }


  // SEARCH
  searchSubmit(event: Event): void{
    event.preventDefault();
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {city:'', search: this.search.value, perPage:15 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false
  }

  // DELETE SEARCH
  clearSearch(event): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.search.reset();
    this.statusComponent = {city:'', search:'', perPage:15 };
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false
  }

  // INIFINITE SCROLL
  loadData(event, total) {
    setTimeout(() => {
      this.statusComponent = {...this.statusComponent, perPage:(this.statusComponent?.perPage + 15) };
      if(this.statusComponent?.perPage  >= total){
        if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = true
      }
      this.infiniteScroll$.next(this.statusComponent)
      event.target.complete();
    }, 500);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.search.reset();
      this.statusComponent = {city:'', search: '', perPage: 15};
      this.infiniteScroll$.next(this.statusComponent);
      if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false

      event.target.complete();
    }, 500);
  }

  // FILTER
  changeFilter({detail: {value}}): void{
    this.search.reset();
    this.statusComponent = {search:'', city:value, perPage: 15};
    this.infiniteScroll$.next(this.statusComponent);
    if(this.ionInfiniteScroll) this.ionInfiniteScroll.disabled = false
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }



}
