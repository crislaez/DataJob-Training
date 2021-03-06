import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RootComponent } from './layout/root.page';
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  declarations: [RootComponent]
})
export class CoreModule {}
