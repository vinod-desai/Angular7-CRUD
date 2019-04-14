import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchMovieService {
    constructor(private httpClient: HttpClient) {
    }

    searchOMDB(srchTxt: string): Observable<any> {
        const movieURL = `http://www.omdbapi.com/?s=${srchTxt}&apikey=m12585b1`;
        const result = this.httpClient.get(movieURL);
        // console.log(result);
        return result;
    }

    movieDetails(imdbID: string): Observable<any> {
        const movieURL = `http://www.omdbapi.com/?i=${imdbID}&apikey=m12585b1`;
        const result = this.httpClient.get(movieURL);
        // console.log(result);
        return result;
    }

}
