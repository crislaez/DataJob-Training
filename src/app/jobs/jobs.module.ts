import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JobsPage } from './containers/jobs.page';
import { JobPage } from './containers/job.page.component';
import { JobsPageRoutingModule } from './jobs-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { JobsModule } from '@datajobs/shared/jobs/jobs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobsPageRoutingModule,
    TranslateModule.forChild(),
    JobsModule
  ],
  declarations: [
    JobsPage,
    JobPage
  ]
})
export class JobsPageModule {}
