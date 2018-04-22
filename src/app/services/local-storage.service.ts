import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
    
    set(key:any, value:any) {
        localStorage[key] = value;
    }
    get (key: any, defaultVal?:any) {
        return localStorage[key] || defaultVal;
    }
    removeItem (key: any) {
        localStorage.removeItem(key);
    }
    setObj (key: any , value: any) {
        this.set(key,JSON.stringify(value));
    }
    getObj (key: any) {
        return JSON.parse(this.get(key) || '{}');
    }
    setUserData (keyOrObj:any, value?:any) {
        var userData = this.getObj('userData');
        if(typeof keyOrObj === 'string'){
            userData[keyOrObj]=value;
        }else{
            Object.assign(userData, keyOrObj);
            //angular.merge(userData, keyOrObj);
        }
        this.setObj('userData',userData);//merge & save
        return true;
    }
    getUserData (key?: any) {
        var userData = this.getObj('userData');
        return key ? userData[key] : userData;
    }
    storeInCache (key: any, value: any) {
        var appCache = {};
        if (sessionStorage["cachedData"]) {
            appCache = JSON.parse(sessionStorage["cachedData"]);
        }
        appCache[key] = value;
        sessionStorage["cachedData"] = JSON.stringify(appCache);
    }
    getFromCache(key: any) {
        if (sessionStorage["cachedData"]){
            var storedNames = JSON.parse(sessionStorage["cachedData"]);
            if (storedNames[key]) {
                return storedNames[key];
            }else{
                return false;
            }
        }
    }
}
