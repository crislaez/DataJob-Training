import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NoDataComponent } from './no-data.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    NoDataComponent
  ],
  exports: [
    NoDataComponent
  ],
})
export class NoDataModule { }
