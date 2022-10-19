import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@datajobs/shared/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
})
export class HeaderModule { }
