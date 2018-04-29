import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {
    }
    private headers: Headers = new Headers({
        "Content-Type'": 'application/x-www-form-urlencoded; charset=UTF-8'
    });


    login(email: string, password: string) {
        const API_URL = environment.apiEndpoint + `/api/v1/auth/login`;

        //JSON.stringify({ email: email, password: password })
        ///api/authenticate
        return this.http.post(API_URL, { "email": email, "password": password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();

                if (user && user.data.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}