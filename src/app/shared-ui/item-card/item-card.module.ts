import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './item-card.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ItemCardComponent
  ],
  exports: [
    ItemCardComponent
  ],
})
export class ItemCardModule { }
