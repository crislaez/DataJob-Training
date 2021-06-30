import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { JobEffects } from './effects/job.effects';
import * as fromJob from './reducers';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreModule.forFeature(fromJob.jobKey, fromJob.reducer),
    EffectsModule.forFeature([JobEffects])
  ]
})
export class JobsModule {}
