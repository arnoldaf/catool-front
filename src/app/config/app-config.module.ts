
import { NgModule, InjectionToken } from '@angular/core';
import { Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

    export class AppConfig {
    API_END_POINT: string;
    API_URLS: any;
    ALERT_DISPLAY_TIME: number;
    ALERT_MESSAGES: any;
    LOADER_TIMEOUT: any;
    HTTP_REQUEST_TIMEOUT: any;
    HTTP_STATUS_MSGS: any;
    }

    export const APP_DI_CONFIG: AppConfig = {
    //API_END_POINT: "http://127.0.0.1:8000/api/v1/",
    API_END_POINT: environment.apiEndpoint + '/api/v1/',
    API_URLS: {
    user: 'user',
    getUsers: 'getUsers',
    vendor : 'vendor',
    vendorBilling : 'vendorBilling',
    emailtemplate : 'emailtemplate',
    emailgroup : 'emailgroup',

    },
    //To display time duration for all Alert, Notification Messages
    ALERT_DISPLAY_TIME: 4000, //4 Seconds
    LOADER_TIMEOUT: 500, //Half Second
    HTTP_REQUEST_TIMEOUT: 20000, //20 Seconds
    ALERT_MESSAGES: {
    unidentifiedError: 'Somthing went wrong.',
    incorrectServerResponse: 'Server is not responding properly',
    DashboardNoFilterMsg: 'Please choose atleast one filter!'
    },

    //All http status custom messages
    HTTP_STATUS_MSGS: {
    default: 'Something Went Wrong',
    '0': 'Network Connection Error',
    '400': 'Bad request',
    '401': 'Unauthorized request',
    '402': 'Content Not Found',
    '403': 'Forbidden',
    '404': 'Requested content not found',
    '406': 'Request not acceptable by server',
    '409': 'Request data is conflicted',
    '422': 'Unprocessable Entity',
    '500': 'Internal server error'
    },
    //Default dynamic forms configurations
    };

    @NgModule({
    providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
    }]
    })
    export class AppConfigModule { }

