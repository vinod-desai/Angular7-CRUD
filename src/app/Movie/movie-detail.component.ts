import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  @Input() movieInfo: any;
  constructor() { }

  ngOnInit() {
    // this.srchMovie.movieDetails(this.imdbId);
  }

}
