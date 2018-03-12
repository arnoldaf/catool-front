import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { AppHttpService } from './app-http.service';


@Injectable()
export class AsideNavService {
   private navResource = '/aside-navs';  // URL to web api

  constructor(private appHttpService: AppHttpService) { }

  getAsideNav (): Observable<any> {
    return this.appHttpService.get(this.navResource, null, null)
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
  private handleError<T> (operation = 'operation', result?: T) {
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
