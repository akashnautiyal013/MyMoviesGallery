import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule}  from 'angularfire2/database';
import {GetMoviesService} from './services/get-movies.service' ;

import {UserRegistrationService} from './services/user-registration.service';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {RouterModule,Router} from '@angular/router';
import {RatingModule} from "ngx-rating";
import {environment} from './../environments/environment';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './components/login/login.component';
import { MyMovieGalleryComponent } from './components/my-movie-gallery/my-movie-gallery.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { StarRatingModule } from 'angular-star-rating';
const Routes = [
	{path:'home',component:HomeComponent},
	{path:'login',component:LoginComponent},
	{path:'mygallery',component:MyMovieGalleryComponent},
	{path:'',redirectTo:'/login',pathMatch:'full'},
	{path:'**',redirectTo:'/login',pathMatch:'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MyMovieGalleryComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(Routes ),
    StarRatingModule.forRoot(),
    RatingModule,

  ],
  providers: [
    UserRegistrationService,
    GetMoviesService
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { 
}
