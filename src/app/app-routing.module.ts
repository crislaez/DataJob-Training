import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'jobs',
    loadChildren: () => import('./views/jobs/jobs.module').then( m => m.JobsPageModule)
  },
  {
    path: 'trainings',
    loadChildren: () => import('./views/trainings/trainings.module').then( m => m.TrainingsPageModule)
  },
  {
    path: '**',
    redirectTo: 'jobs',
    pathMatch: 'full',
  }
];
@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
