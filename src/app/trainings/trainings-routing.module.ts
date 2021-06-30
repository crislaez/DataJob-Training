import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingPage } from './containers/training.page.component';
import { TrainingsPage } from './containers/trainings.page';


const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'',
        component: TrainingsPage
      },
      {
        path:':idTraining',
        component: TrainingPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingsPageRoutingModule {}
