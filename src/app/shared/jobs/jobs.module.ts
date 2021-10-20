import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationModule } from '@datajobs/shared/notification/notification.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { JobEffects } from './effects/job.effects';
import * as fromJob from './reducers/job.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    NotificationModule,
    StoreModule.forFeature(fromJob.jobFeatureKey, fromJob.reducer),
    EffectsModule.forFeature([JobEffects])
  ]
})
export class JobsModule {}
