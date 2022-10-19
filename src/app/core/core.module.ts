import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationModalModule } from '../shared-ui/notification-modal/notification-modal.module';
import { RootComponent } from './layout/root.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    NotificationModalModule,
    TranslateModule.forChild(),
  ],
  declarations: [RootComponent]
})
export class CoreModule {}
