import { Injectable, Inject } from '@angular/core';
//import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { APP_CONFIG, AppConfig } from '../config/app-config.module';
//import { ConfirmCallback } from '../directives/confirm/confirm-callback';

declare var Materialize: any;
declare let toastr: any;

@Injectable()
export class AlertService {
    public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private loaderReqCount: number;
    //confirmCallback: ConfirmCallback;
    private confirmSource = new Subject<String>();
    confirm$ = this.confirmSource.asObservable();
    private confirmResult: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    confirmed$ = this.confirmSource.asObservable();
    private subject = new Subject<any>();
    private formErrResource = new Subject<any>();
    private formMetaResource = new Subject<any>();
    // private keepAfterNavigationChange = false;

    constructor(
        @Inject(APP_CONFIG) private appConfig: AppConfig
    ) {
        this.loaderReqCount = 0;
    }
    //    constructor(private router: Router) {
    //        // clear alert message on route change
    //        router.events.subscribe(event => {
    //            if (event instanceof NavigationStart) {
    //                if (this.keepAfterNavigationChange) {
    //                    // only keep for a single location change
    //                    this.keepAfterNavigationChange = false;
    //                } else {
    //                    // clear alert
    //                    this.subject.next();
    //                }
    //            }
    //        });
    //    }

    info(message: string) {
        //Materialize.toast(message, 5000, 'light-blue');
        toastr.warning(message, 'light-blue');
    }

    warning(message: string) {
        //Materialize.toast(message, 5000, 'Warning!');
        toastr.warning(message, 'Warning!');
    }

    success(message: string) {
        //Materialize.toast(message, 5000, 'Success!');
        toastr.success(message, 'Success!')
    }

    error(message: string) {
        //Materialize.toast(message, 5000, 'Error!');
        toastr.error(message, 'Error!');
    }

    /*success(message: string) {
    //success(message: string, keepAfterNavigationChange = false) {
       // this.keepAfterNavigationChange = keepAfterNavigationChange;
       setTimeout(()=>{
            this.subject.next({ type: 'success', text: message });
            this.clearAlert();
        });
    }
    error(message: string) {
    //error(message: string, keepAfterNavigationChange = false) {
        //this.keepAfterNavigationChange = keepAfterNavigationChange;
        setTimeout(()=>{
            this.subject.next({ type: 'error', text: message });
            this.clearAlert();
        });
    }*/

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    public emitFormError(formErr) {
        this.formErrResource.next(formErr);
    }
    get getFormError$() {
        return this.formErrResource.asObservable();
    }
    public emitFormMeta(formErr) {
        this.formMetaResource.next(formErr);
    }
    get getFormMeta$() {
        return this.formMetaResource.asObservable();
    }
    clearAlert() {
        setTimeout(() => { this.subject.next() }, this.appConfig.ALERT_DISPLAY_TIME);
    }

    displayLoader(value: boolean) {
        if (value) {
            this.loaderStatus.next(value);
            this.loaderReqCount++;
        } else {
            this.loaderReqCount--;
            if (this.loaderReqCount < 1) {
                setTimeout(() => { this.loaderStatus.next(value) }, this.appConfig.LOADER_TIMEOUT);
            }
        }
    }

    confirm(message: string): any {
        if (message) {
            this.confirmSource.next(message);
        } else {
            setTimeout(() => { this.confirmSource.next(message) }, this.appConfig.LOADER_TIMEOUT);
        }
    }
    setConfirm(result: any): any {
        this.confirmSource.next(result);
    }
}