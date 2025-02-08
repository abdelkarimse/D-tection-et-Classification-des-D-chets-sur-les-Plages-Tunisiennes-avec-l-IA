import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DefaultComponent } from './components/default/default.component';
import { AnalyseImageComponent } from './components/analyse-image/analyse-image.component';
import { AnalyseVideoComponent } from './components/analyse-video/analyse-video.component';
import { AnalyseDirectComponent } from './components/analyse-direct/analyse-direct.component';
import { StatistiquesComponent } from './components/statistiques/statistiques.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DefaultComponent },
      { path: 'analyse-image', component: AnalyseImageComponent },
      { path: 'analyse-video', component: AnalyseVideoComponent },
      { path: 'analyse-direct', component: AnalyseDirectComponent },
      { path: 'statistiques', component: StatistiquesComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
