import { Component, OnInit } from '@angular/core';

import { SearchMovieService } from './search-movie.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  movies: any[];
  searchText: string;
  movieDetail: any;
  constructor(private srchMovie: SearchMovieService) { }

  ngOnInit() {
    /* this.srchMovie.searchOMDB('batman').subscribe( data => {
      // console.log(typeof data);
      // console.log(data.Search);
      this.movies = data.Search;
    }
    ); */
  }

  searchMovies(): void {
    // console.log(this.searchText);
    if (this.searchText !== '') {
      this.srchMovie.searchOMDB(this.searchText)
      .subscribe( data => {
        this.movies = data.Search;
      });
    }
  }

  viewMovieDetails(id: string): void {
    this.srchMovie.movieDetails(id)
      .subscribe( data => {
        this.movieDetail = data;
      });
  }

}
