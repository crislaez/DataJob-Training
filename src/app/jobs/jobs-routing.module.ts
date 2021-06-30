import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobPage } from './containers/job.page.component';
import { JobsPage } from './containers/jobs.page';


const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'',
        component: JobsPage
      },
      {
        path:':idJob',
        component: JobPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsPageRoutingModule {}
