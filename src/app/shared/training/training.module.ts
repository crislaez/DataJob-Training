import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TrainingEffects } from './effects/training.effects';
import * as fromTraining from './reducers';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreModule.forFeature(fromTraining.trainingKey, fromTraining.reducer),
    EffectsModule.forFeature([TrainingEffects])
  ]
})
export class TrainingModule {}
