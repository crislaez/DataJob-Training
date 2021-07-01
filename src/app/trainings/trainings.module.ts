import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainingsPage } from './containers/trainings.page';
import { TrainingPage } from './containers/training.page.component';
import { TrainingsPageRoutingModule } from './trainings-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingModule } from '@datajobs/shared/training/training.module';
import { SharedModule } from '@datajobs/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingsPageRoutingModule,
    TranslateModule.forChild(),
    TrainingModule,
    SharedModule
  ],
  declarations: [
    TrainingsPage,
    TrainingPage
  ]
})
export class TrainingsPageModule {}
