import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationModalComponent } from './notification-modal.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    NotificationModalComponent
  ],
  exports: [
    NotificationModalComponent
  ],
})
export class NotificationModalModule { }
