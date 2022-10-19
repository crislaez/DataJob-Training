import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrainingModule } from '@datajobs/shared/training/training.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterModalModule } from 'src/app/shared-ui/filter-modal/filter-modal.module';
import { HeaderModule } from 'src/app/shared-ui/header/header.module';
import { InfiniteScrollModule } from 'src/app/shared-ui/infinite-scroll/infinite-scroll.module';
import { ItemCardModule } from 'src/app/shared-ui/item-card/item-card.module';
import { NoDataModule } from 'src/app/shared-ui/no-data/no-data.module';
import { SpinnerModule } from 'src/app/shared-ui/spinner/spinner.module';
import { TrainingPage } from './containers/training.page.component';
import { TrainingsPage } from './containers/trainings.page';
import { TrainingsPageRoutingModule } from './trainings-routing.module';

const SHARED_MODULE = [
  TrainingModule,
  // SharedModule
];

const SHARED_UI_MODULE = [
  NoDataModule,
  HeaderModule,
  SpinnerModule,
  ItemCardModule,
  FilterModalModule,
  InfiniteScrollModule
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ...SHARED_MODULE,
    ...SHARED_UI_MODULE,
    TranslateModule.forChild(),
    TrainingsPageRoutingModule,
  ],
  declarations: [
    TrainingsPage,
    TrainingPage
  ]
})
export class TrainingsPageModule {}
