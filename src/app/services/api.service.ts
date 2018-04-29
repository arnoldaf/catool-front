import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Request, Response, RequestOptions, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';

import { APP_CONFIG, AppConfig } from '../config/app-config.module';
import { AlertService } from './alert.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ApiService {
    constructor(
        private http: Http,
        private requestoptions: RequestOptions,
        @Inject(APP_CONFIG) private appConfig: AppConfig,
        private alertService: AlertService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) { }

    /*
     * Method makeReq
     * @paran urlKey: string
     * @param (optional)options: any
     * @return observable
     * @author DZONE
     */
    makeReq(urlKey: string, options?: any) {
        options = (options) ? options : {};
        const requestOptions = new RequestOptions({
            // RequestMethod: [Get, Post, Put, Delete, Options, Head, Patch]
            method: (options.method) ? RequestMethod[options.method] : RequestMethod.Get,
            url: this.getUrl(urlKey, options),
            headers: this.makeHeader((options.headers) ? options.headers : {}),
            //body: { 'id': 11, 'currentPage': 12 },
            body: JSON.stringify((options.body) ? options.body : {}),
            params: (options.params) ? options.params : {}
        });
        return this.http.request(new Request(requestOptions))
            .timeout(this.appConfig.HTTP_REQUEST_TIMEOUT)
            .map((res: Response) => {
                let resData = res.json();
                return resData;
            }).catch((error: any) => {
                return this.handleError(error);
            });
    }

    /*---------------- private helper methods---------------------------*/
    /*
     * Method handleError
     * @paran error: any
     * @return any
     * @author DZONE
     */
    private handleError(error: any) {
        error.body = error.hasOwnProperty('_body') ? ((typeof error._body === 'object') ? error._body : JSON.parse(error._body)) : false;
        error.msg = this.appConfig.HTTP_STATUS_MSGS[this.appConfig.HTTP_STATUS_MSGS.hasOwnProperty(error.status)
            ? error.status : 'default'];
        if (error.hasOwnProperty('name') && error.name == 'TimeoutError') {
            return Observable.throw({ status: 408, msg: 'Request timeout has occurred!' });
        } else if (error.hasOwnProperty('status') && error.status == 401) {
            if (error.body && error.body.hasOwnProperty('action') && error.body.action == 'logout') {
                error.msg = 'Session expired';
                // remove user from local storage to log user out
                this.localStorageService.removeItem('userData');
                this.router.navigate(['/login']);
            }
        }
        return Observable.throw({
            status: error.status,
            msg: error.msg,
            body: error.body
        });
    }
    /*
     * Method makeHeader: To make API request header
     * @options : Object
     * @return Object
     * @author DZONE
     */
    makeHeader(options: Object) {
        const headers = new Headers();
        // Accept
        if (options['Accept']) {
            headers.append('Accept', options['Accept']); // Desired Accept
        } else {
            headers.append('Accept', 'application/json'); // Default Accept
        }
        // Accept-Language
        if (options['Accept-Language']) {
            headers.append('Accept-Language', options['Accept-Language']); // Desired Accept-Language
        }
        // Content-Language
        if (options['Content-Language']) {
            headers.append('Content-Language', options['Content-Language']); // Desired Content-Language
        }
        // Content-Type
        if (options['Content-Type']) {
            headers.append('Content-Type', options['Content-Type']); // Desired Content-Type
        } else {
            headers.append('Content-Type', 'application/json'); // Default
        }
        // DPR
        if (options['DPR']) {
            headers.append('DPR', options['DPR']); // Desired DPR
        }
        // Downlink
        if (options['Downlink']) {
            headers.append('Downlink', options['Downlink']); // Desired Downlink
        }
        // Save-Data
        if (options['Save-Data']) {
            headers.append('Save-Data', options['Save-Data']); // Desired Content-Language
        }
        // Viewport-Width
        if (options['Viewport-Width']) {
            headers.append('Viewport-Width', options['Viewport-Width']); // Desired Viewport-Width
        }
        // Width
        if (options['Width']) {
            headers.append('Width', options['Width']); // Desired Viewport-Width
        }
        // add authentication token
        var currentUser = localStorage.getItem('currentUser');
        var obj = JSON.parse(currentUser);
        //headers.append('Authorization', 'Bearer ' + this.localStorageService.getUserData('authToken'));
        headers.append('Authorization', 'Bearer ' + obj.data.token);
        return headers;
    }
    /*
     * Method getUrl
     * @paran urlKey: string
     * @param (optional)options: any
     * @return string
     * @author DZONE
     */
    private getUrl(urlKey: string, options?: any) {
        if (options.completeUrl) {
            return urlKey;
        }
        return (this.appConfig.API_END_POINT + this.appConfig.API_URLS[urlKey] + ((options.urlData) ? '/' + options.urlData : ''));
    }
    /*
     * Method getLangCode
     * @paran urlKey: string
     * @param (optional)options: any
     * @return string
     * @author DZONE
     */
    private getLangCode(urlKey: string, options?: any) {
        if (options.completeUrl) {
            return urlKey;
        }
        return (this.appConfig.API_END_POINT + this.appConfig.API_URLS[urlKey] + ((options.urlData) ? '/' + options.urlData : ''));
    }

    /*
     * Method makeFileReq
     * @paran urlKey: string
     * @param (optional)options: any
     * @return observable
     * @author DZONE
     */
    public makeFileReq(urlKey: string, options?: any): any {
        return Observable.create(observer => {
            const formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            // Add Files to form data
            for (let i = 0; i < options.files.length; i++) {
                formData.append(options.fileKeyName, options.files[i], options.files[i].name);
            }
            // Add form fields to formdata
            for (let formField in options.formFields) {
                formData.append(formField, options.formFields[formField]);
            }

            xhr.open('POST', this.getUrl(urlKey, options), true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.localStorageService.getUserData('authToken'));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.addEventListener('error', function(event) {
                //console.log('Oups! files something went wrong.');
            });
            // Define what happens on successful data submission
            xhr.addEventListener('load', function(event) {
                //console.log('Yeah! Image sent and response loaded.');
            });

            xhr.upload.onprogress = (event) => {
                //this.progress = Math.round(event.loaded / event.total * 100);
                //this.progressObserver.next(this.progress);
            };
            xhr.send(formData);
        });
    }
    /*
     * Method downloadFile : To download file by XHR from any url
     * @paran urlKey: string
     * @param (optional)options: any
     * @return observable
     * @author DZONE
     */
    public downloadFile(urlKey, options?: any) {
        return Observable.create(observer => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.getUrl(urlKey, options), true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.localStorageService.getUserData('authToken'));
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status === 200) {
                        let a = document.createElement('a');
                        document.body.appendChild(a);
                        let url = window.URL.createObjectURL(xhr.response);
                        a.href = url;
                        a.download = options.fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);

                        // window.open(URL.createObjectURL(xhr.response), '_blank');
                        observer.next(true);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.send(null);
        });
    }
}
