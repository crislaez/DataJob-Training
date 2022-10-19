import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JobsModule } from '@datajobs/shared/jobs/jobs.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterModalModule } from 'src/app/shared-ui/filter-modal/filter-modal.module';
import { HeaderModule } from 'src/app/shared-ui/header/header.module';
import { InfiniteScrollModule } from 'src/app/shared-ui/infinite-scroll/infinite-scroll.module';
import { ItemCardModule } from 'src/app/shared-ui/item-card/item-card.module';
import { NoDataModule } from 'src/app/shared-ui/no-data/no-data.module';
import { SpinnerModule } from 'src/app/shared-ui/spinner/spinner.module';
import { JobPage } from './containers/job.page.component';
import { JobsPage } from './containers/jobs.page';
import { JobsPageRoutingModule } from './jobs-routing.module';


const SHARED_MODULE = [
  JobsModule,
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
    JobsPageRoutingModule,
  ],
  declarations: [
    JobsPage,
    JobPage
  ]
})
export class JobsPageModule {}
