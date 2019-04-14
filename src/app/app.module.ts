import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { EmployeeModule } from './employee/employee.module';

import { EmployeeService } from './employee/employee.service';
import { SearchMovieService } from './Movie/search-movie.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './home/page-not-found.component';
import { MovieSearchComponent } from './Movie/movie-search.component';
import { MovieDetailComponent } from './Movie/movie-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    MovieSearchComponent,
    MovieDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // EmployeeModule, Lazy loading Employee Module
    AppRoutingModule,
    FormsModule
  ],
  providers: [EmployeeService, SearchMovieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
