import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationModule } from '@datajobs/shared/notification/notification.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingEffects } from './effects/training.effects';
import * as fromTraining from './reducers/training.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    NotificationModule,
    StoreModule.forFeature(fromTraining.trainingFeatureKey, fromTraining.reducer),
    EffectsModule.forFeature([TrainingEffects])
  ]
})
export class TrainingModule {}
