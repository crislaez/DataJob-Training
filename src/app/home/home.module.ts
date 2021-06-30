import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './containers/home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@datajobs/shared/shared/shared.module';
import { JobsModule } from '@datajobs/shared/jobs/jobs.module';
import { TrainingModule } from '@datajobs/shared/training/training.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule.forChild(),
    SharedModule,
    JobsModule,
    TrainingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
