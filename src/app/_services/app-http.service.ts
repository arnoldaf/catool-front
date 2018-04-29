import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AppHttpService implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'domain': 'abc.com'})
  };

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    // Make the HTTP request:
  }



  appendHeaders(headers): void {
    for (const property in headers) {
      if (headers.hasOwnProperty(property) && !this.httpOptions.headers.has(property)) {
        this.httpOptions.headers = this.httpOptions.headers.append(property, headers[property]);
      }
    }
  }

  getUrl(resoucesUrl): string {
    return environment.apiEndpoint + '/api/v1' + resoucesUrl;
  }

  get(url, payload, headers): Observable<any> {
    let apiUrl = this.getUrl(url);
    // tslint:disable-next-line:no-unused-expression
    headers ? this.appendHeaders(headers) : '';
    return payload ? this.http.get(apiUrl, { params: payload }) : this.http.get(apiUrl);
  }

  post(url, payload, headers): Observable<any> {
    let apiUrl = this.getUrl(url);
    // tslint:disable-next-line:no-unused-expression
    headers ? this.appendHeaders(headers) : '';
    return this.http.post(apiUrl, payload, this.httpOptions);
  }
  put(url, payload, headers): Observable<any> {
    let apiUrl = this.getUrl(url);
    // tslint:disable-next-line:no-unused-expression
    headers ? this.appendHeaders(headers) : '';
    return this.http.put(apiUrl, payload, this.httpOptions);
  }
  delete(url, headers): Observable<any> {
    let apiUrl = this.getUrl(url);
    // tslint:disable-next-line:no-unused-expression
    headers ? this.appendHeaders(headers) : '';
    return this.http.delete(apiUrl, this.httpOptions);
  }

}
