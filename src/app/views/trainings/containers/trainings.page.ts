import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { fromTraining, TrainingActions } from '@datajobs/shared/training';
import { Training } from '@datajobs/shared/training/models/index';
import { gotToTop, municipalities, trackById } from '@datajobs/shared/utils/functions';
import { IonContent, IonInfiniteScroll, ModalController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { FilterModalComponent } from 'src/app/shared-ui/filter-modal/filter-modal.component';
import { TrainingPageState } from '../model';


@Component({
  selector: 'app-trainings',
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="true" (ionScroll)="logScrolling($any($event))">

      <app-header
        [title]="'COMMON.TRAININGS'"
        [searchLabel]="'COMMON.SEARCH_BY_TRAINING'"
        [reset]="reset"
        (searchSubmit)="searchSubmit($event)"
        (clearSearch)="clearSearch()"
        (presentModal)="presentModal()">
      </app-header>

      <div class="container components-dark-color">
        <ng-container *ngIf="(info$ | async) as info">
          <ng-container *ngIf="(status$ | async) as status">
            <ng-container *ngIf="status !== 'pending'; else loader">
              <ng-container *ngIf="status !== 'error';  else serverError">
                <ng-container *ngIf="info?.trainings?.length > 0; else noData">

                  <app-item-card
                    *ngFor="let training of info?.trainings; let i = index; trackBy: trackById"
                    [item]="training"
                    [from]="'trainings'"
                    [index]="i">
                  </app-item-card>

                  <!-- INFINITE SCROLL  -->
                  <app-infinite-scroll
                    [slice]="info?.trainings?.length"
                    [status]="status"
                    [total]="info?.total"
                    (loadDataTrigger)="loadData($event)">
                  </app-infinite-scroll>

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
          <app-no-data [title]="'COMMON.ERROR'" [image]="'assets/images/error.png'" [top]="'0vh'"></app-no-data>
        </ng-template>

        <!-- IS NO DATA  -->
        <ng-template #noData>
          <app-no-data [title]="'COMMON.NORESULT'" [image]="'assets/images/empty.png'" [top]="'0vh'"></app-no-data>
        </ng-template>

        <!-- LOADER  -->
        <ng-template #loader>
          <app-spinner [top]="'60%'"></app-spinner>
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

  municipalities = municipalities;
  gotToTop = gotToTop;
  trackById = trackById;
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static: true}) content: IonContent;
  reset = false
  showButton = false;
  slice = 10;

  status$ = this.store.pipe(select(fromTraining.getStatus));
  trigger = new EventEmitter<TrainingPageState>();
  statusComponent: TrainingPageState = {
    municipality:'',
    search:'',
    slice: this.slice,
  };

  info$ = this.trigger.pipe(
    startWith(this.statusComponent),
    tap(({reload}) => {
      if(reload){
        this.store.dispatch(TrainingActions.loadTrainings());
      }
    }),
    switchMap(({municipality, search, slice}) => {
      return this.store.select(fromTraining.getTrainings).pipe(
        map(trainings => {
          let result = municipality || search
              ? this.getFilterTrainings(trainings, search, municipality)
              : trainings;

          return {
            trainings: result.slice(0, slice),
            total: result?.length
          }
        })
      )
    })
    // ,tap(d => console.log(d))
  );

  constructor(
    private store: Store,
    public platform: Platform,
    public modalController: ModalController
  ) { }


  // SEARCH
  searchSubmit(search: string): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {
      ...this.statusComponent,
      search,
      slice: this.slice,
      reload: false
    };
    this.trigger.next(this.statusComponent);
  }

  // DELETE SEARCH
  clearSearch(): void{
    if(!this.platform.is('mobileweb')) Keyboard.hide();
    this.statusComponent = {
      ...this.statusComponent,
      search: null,
      slice: this.slice,
      reload: false
    };
    this.trigger.next(this.statusComponent);
  }

  // INIFINITE SCROLL
  loadData({event, total}) {
    setTimeout(() => {
      this.statusComponent = {
        ...this.statusComponent,
        slice:(this.statusComponent?.slice + this.slice),
        reload: false
      };
      this.trigger.next(this.statusComponent)
      event.target.complete();
    }, 500);
  }

  // REFRESH
  doRefresh(event) {
    setTimeout(() => {
      this.reset = true;
      this.statusComponent = {
        municipality: null,
        search: null,
        slice: this.slice,
        reload: true
      };
      this.trigger.next(this.statusComponent);
      event.target.complete();
    }, 500);
  }

  getFilterTrainings(trainings: any[], search: string, municipality: string): Training[] {
    return (trainings || [])?.filter(({value}) => {
      const { municipio = null, titulo = null } = value || {};

      const municipalityCondition = municipio?.toLowerCase()?.includes(municipality?.toLowerCase());
      const searchCondition = titulo?.toLowerCase()?.includes(search?.toLowerCase());

      if(municipality && search) return municipalityCondition && searchCondition;
      if(municipality && !search) return municipalityCondition;
      if(!municipality && search) return searchCondition;
    });
  }

  // OPEN FILTER MODAL
  async presentModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        inputFilter: this.statusComponent?.municipality,
        municipalities,
      }
    });

    modal.present();

    const { data = null } = await modal.onDidDismiss();
    if(!data || Object.keys(data || {})?.length === 0) return;

    this.statusComponent = { ...data, search:null, refresh:false };
    this.trigger.next(this.statusComponent)
  }

  // SCROLL EVENT
  logScrolling({detail:{scrollTop}}): void{
    if(scrollTop >= 300) this.showButton = true
    else this.showButton = false
  }


}
