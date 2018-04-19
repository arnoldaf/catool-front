import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//const httpOptions = {
   // headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//};
var token = '';
var currentUser = localStorage.getItem('currentUser');
if(currentUser != null) {
var obj = JSON.parse(currentUser);
token = obj.data.token;
}
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : 'Bearer '+token})
};


@Injectable()
export class AsideNavService {
    private navUrl = environment.apiEndpoint + '/api/v1/aside-navs';  // URL to web api

    constructor(private http: HttpClient) { }

    getAsideNav(): Observable<any> {
        return this.http.get(this.navUrl, httpOptions)
            .pipe(
            tap(asideNav => this.log(`fetched menu`)),
            catchError(this.handleError('getAsideNav', []))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log(message);
    }
}
