/* 
 @name AuthService
 @meta Centralized user authentication
 @version 1.0
 @date Apri 10, 2018
 @author DZONE
 @copyright DZONE Inc
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {
    userRole = 'USER';
    constructor(
        private router: Router,
        private apiService: ApiService,
        private alertService: AlertService,
        private localStorageService: LocalStorageService,
    ) {
        this.userRole = this.localStorageService.getUserData('userRole') || 'USER';
    };

    public doLogin(data: any): any {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('login', { method: 'Post', body: data })
            .subscribe((res) => {
                this.alertService.displayLoader(false);
                try {
                    if ((res.status_code >= 200 && res.status_code < 300) && res.data && res.data.token) {
                        this.localStorageService.setUserData({
                             authToken: res.data.token,
                            isLogin: 1,
                            username: res.data.username,
                            userRole: res.data.role,
                            userType: res.data.type
                        });
                        //this.router.navigate(['/admin/dashboard']); 
                        // this.router.navigate([this.getUrlRole() + '/dashboard']); //decide user type
                        setTimeout(() => { this.router.navigate(["/" + res.data.redirect]); }, 1010);
                        return true;
                    } else {
                        this.alertService.error(res.message ? res.message : 'Authenticantion failed due to some error!');
                    }
                } catch (error) {
                    this.alertService.error(res.msg ? res.msg : 'Authenticantion failed due to some error!');
                }
            },
            (error: any) => {
                this.alertService.displayLoader(false);
                this.alertService.error(error.msg ? error.msg : 'Authenticantion failed due to some error!');
            });
    }

    logout() {
        // remove user from local storage to log user out
        this.localStorageService.removeItem('userData');
        this.router.navigate(['/login']);
    }
    
    checkLogin() {
        if (this.localStorageService.getUserData('isLogin')) {
            return true;
        }
        
        this.logout();
        
        return false;
    }
    
    alreadyLogin() {
        if (this.localStorageService.getUserData('isLogin')) {
            this.router.navigate(['']);
            return true;
        }
        
        return false;
    }

    getUserRole() {
        let userRole = this.localStorageService.getUserData('userRole');
        //return 'USER';
        return userRole || 'USER'; //Change it to 'ADMIN';
    }

    getUrlRole() {
        return ((this.userRole === 'ADMIN') ? '/admin' : '');
    }

    isTokenExpired(error) {
        
        error = (typeof error == 'string') ? JSON.parse(error) : error;
        
        let errorMsg = (typeof error.body != 'undefined') ? error.body : error;
        let msgBag = {
            'token_expired': 'Session is expired, Please login again', 
            'token_not_provided': 'Session is expired, Please login again', 
            'user_not_found': 'Sorry! User not found', 
            'token_invalid': 'Session is expired, Please login again', 
            'token_absent': 'Session is expired, Please login again'
        };
        
        if (msgBag.hasOwnProperty(errorMsg.error)) {
            this.alertService.error(errorMsg.error ? msgBag[errorMsg.error] : 'Authentication failed due to some error!');
            this.logout();
        }
    }
}