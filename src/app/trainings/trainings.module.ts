import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrainingsPage } from './containers/trainings.page';
import { TrainingPage } from './containers/training.page.component';
import { TrainingsPageRoutingModule } from './trainings-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingModule } from '@datajobs/shared/training/training.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingsPageRoutingModule,
    TranslateModule.forChild(),
    TrainingModule
  ],
  declarations: [
    TrainingsPage,
    TrainingPage
  ]
})
export class TrainingsPageModule {}
