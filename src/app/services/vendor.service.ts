import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
//import { LocalStorageService } from './local-storage.service';
@Injectable()
export class VendorService {


    private _subject = new Subject<any>();
    private uploadResource = new Subject<any>();
    constructor(
        private router: Router,
        private apiService: ApiService,
        private alertService: AlertService,
        // private localStorageService: LocalStorageService,
    ) { };

    /*    
    public getLogin(): any {
      //get form data
      return this.apiService.makeReq('getLogin');
    }
  
    public getResetPassword(): any {
      //get form data
      return this.apiService.makeReq('getResetPassword');
    }
    public getForgotPassword(): any {
      //get form data
      return this.apiService.makeReq('getForgotPassword');
    }
    public addUser(data: any): any {
      //get form data
      return this.apiService.makeReq('addUsers', { method: 'Post', body: data });
    }
    public editUser(data: any, urlData?: any): any {
      //get form data
      return this.apiService.makeReq('updateUser', { method: 'Post', body: data, urlData: urlData });
    }
  
    
    public changeUserStatus(data: any, urlData: any): any {
      return this.apiService.makeReq('changeUserStatus', { method: 'Put', body: data, urlData: urlData });
    }
    public addWithdrawal(data: any): any {
      //get form data
      if (data) {
        if (data.due_date) {
          data['due_date'] = data.due_date.year + '-' + (data.due_date.month < 10 ? '0' + data.due_date.month : data.due_date.month) + '-' + (data.due_date.day < 10 ? '0' + data.due_date.day : data.due_date.day);
        }
      }
      return this.apiService.makeReq('addUserWithdrawal', { method: 'Post', body: data });
    }
    public getExchangeRate(): any {
      return this.apiService.makeReq('exchangerate');
    }
  
    public setExchangeRate(data: any): any {
      //get form data
      return this.apiService.makeReq('setExchangerate', { method: 'Put', body: data });
    }
    public addDeposit(data: any): any {
      //get form data
      return this.apiService.makeReq('addDeposit', { method: 'Post', body: data });
    }
    public getUsers(): any {
      //get form data
      return this.apiService.makeReq('getUsers');
    }
    public getUserDetails(urlData: any): any {
      //get form data
      return this.apiService.makeReq('userDetail', { urlData: urlData });
    }
  
    public usersList(page?: any): any {
      //get form data
      let params = { page: page };
      return this.apiService.makeReq('users', { params });
    }
  
    public resetPassword(data: any) {
      return this.apiService.makeReq('resetPassword', { method: 'Post', body: data });
    }
    public forgotPassword(data: any) {
      return this.apiService.makeReq('forgotPassword', { method: 'Post', body: data });
    }
    public getWhitelabelList(): any {
      return this.apiService.makeReq('getWhitelabels');
    }
    public getAvailableWhitelabelList(): any {
      return this.apiService.makeReq('availableWhitelabelList');
    }
  
    public getUniqueInvoiceId(): any {
      return this.apiService.makeReq('getUniqueInvoiceId');
    }
    public fileCahnge(event) {
      this._subject.next(event);
    }
    get fileChangeEvent$() {
      return this._subject.asObservable();
    }
    public emitFileState(fileState) {
      this.uploadResource.next(fileState);
    }
    get updateFileState$() {
      return this.uploadResource.asObservable();
    }
    public uploadBlackListUserId(files: File[], fileKeyName: string): any {
      return this.apiService.makeFileReq('uploadInvoiceFile', { files: files, fileKeyName: fileKeyName });
    }
    public withdrawalStatus(data: any): any {
      return this.apiService.makeReq('withdrawalStatus', { method: 'Post', body: data });
    }
    */

}
