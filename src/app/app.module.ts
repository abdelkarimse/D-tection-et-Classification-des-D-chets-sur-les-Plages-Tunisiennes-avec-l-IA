import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DefaultComponent } from './components/default/default.component';
import { AnalyseImageComponent } from './components/analyse-image/analyse-image.component';
import { AnalyseVideoComponent } from './components/analyse-video/analyse-video.component';
import { AnalyseDirectComponent } from './components/analyse-direct/analyse-direct.component';
import { StatistiquesComponent } from './components/statistiques/statistiques.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DefaultComponent,
    AnalyseImageComponent,
    AnalyseVideoComponent,
    AnalyseDirectComponent,
    StatistiquesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
