import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { AlertService } from '../services/alert.service';
import { Helpers } from '../helpers';
import { ScriptLoaderService } from '../_services/script-loader.service';
//import {AuthService} from '../services/auth.service';
declare var $:any;
declare var jQuery:any;
declare let swal: any;

@Component({
    selector: '.m-wrapper',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class UserComponent implements AfterViewInit, OnInit {
    addFormGroup: FormGroup;
    editFormGroup: FormGroup;
    listView = true;
    formSubmitAttempt = false;
    testing = 'this is a test'
    addView = false;
    editView = false;
    userDetail: any = [];
    userList: any = [];
    languages: any = [];
    roles: any = [];
    selectedRole: any;
    selectedLanguage: any;
    selectedStatus: any;
    role_name: any;
    email: any;
    firstname: any;
    lastname: any;
    registerMsg = false;
    registerFrmErr = {};
    modalReference: any;
    closeResult: string;
    isListLoading = true;
    currentPage = 0;
    options: [
        { key: '1', name: 'Enable' },
        { key: '0', name: 'Disable' }
    ];


    @Input() password = '';
    @Input() name = '';
    @Input() id = '';
    @Input() status = '';
    @ViewChild('edit') edit;


    @ViewChild('add') add;

    constructor(
          private fb: FormBuilder,
          private apiService: ApiService,
          private alertService: AlertService,
          private userService: UserService,
          private _script: ScriptLoaderService,

    ) {
       // translate.addLangs(['en', 'fr', 'ur']);
    };

    ngOnInit() {
      this.getUserList();
      this.formGenerate();
    }

    ngAfterViewInit() {
       this._script.loadScripts('app-base-sweetalert2',
            ['assets/demo/default/custom/components/base/sweetalert2.js']);     
    }
    docOnClick(event) {
        this.registerMsg = false;
    }
    userData = {email: '',firstname: '',lastname: '', name: '', password: '', password_confirmation: '', role: '', language: '', status: '', client_type: '', phonenumber: '', profilepic: '', id: ''};

    formGenerate() {

        this.addFormGroup = this.fb.group({
            email: [this.userData.email, [Validators.required]],
            firstname: [this.userData.firstname, [Validators.required, Validators.minLength(4)]],
            lastname: [this.userData.lastname, [Validators.required]],
            password: [this.userData.password, []],
            password_confirmation: [this.userData.password_confirmation, []],
            client_type: [this.userData.client_type, []],
            language: [this.userData.language, []],
            status: [this.userData.status, []],
            phonenumber: [this.userData.phonenumber, []],
            profilepic: [this.userData.profilepic, []],
        });
        this.editFormGroup = this.fb.group({
            email: [this.userData.email, [Validators.required]],
            firstname: [this.userData.firstname, [Validators.required]],
            lastname: [this.userData.lastname, [Validators.required]],
            password: [this.userData.password, [Validators.required]],
            password_confirmation: [this.userData.password_confirmation, [Validators.required]],
            role: [this.userData.role, [Validators.required]],
            client_type: [this.userData.client_type, [Validators.required]],
            language: [this.userData.language, [Validators.required]],
            status: [this.selectedStatus, [Validators.required]],
            phonenumber: [this.userData.phonenumber, [Validators.required]],
            profilepic: [this.userData.profilepic, [Validators.required]],
            id: [this.userData.id, [Validators.required]]
        });
    }

    setValue(value: {[key: string]: any}, {onlySelf, emitEvent}: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
           Object.keys(value).forEach(name => {
            if (this.editFormGroup.get(name) && value[name] != '') {
                this.editFormGroup.controls[name].setValue(value[name], { onlySelf: true, emitEvent });
            }
        });
    }

    addUser() {
        this.listView = false;
        this.addView = true;
        this.editView = false;
        this.formSubmitAttempt = false;
    }

    addFormSubmit(data: any): any {
        
        console.log(this.addFormGroup);
        //Apply codition here or in the form element it self
        if (!this.addFormGroup.valid) {
            this.formSubmitAttempt = true;
            return false;
        } 
        this.apiService.makeReq('getUsers', {method: 'Post', body: this.addFormGroup.value })

            .subscribe((res) => {
                try {
                    if (res.errors.length == 0) {
                       this.alertService.success(res.msg ? res.msg : 'User has been added successfully!');
                       this.getUserList();
                       this.goBack();
                       this.alertService.displayLoader(false);
                       return true;
                    } else {
                         let msg = '';
                         for(var key in res.errors){
                            console.log(key + ' - ' + res.errors[key]);
                            msg = msg + ' <br/>' + res.errors[key];
                        }
                        this.alertService.error(msg ? msg : 'Authentican failed due to some error!');

                    }
                } catch (error) {
                    this.alertService.error(res.msg ? res.msg : 'Authentican failed due to some error!');
                }
            },
            (error: any) => {
                this.alertService.displayLoader(false);
                this.alertService.error(error.msg ? error.msg : 'Authentican failed due to some error!');
            });
    }

    editFormSubmit(data: any): any {
        this.apiService.makeReq('getUsers', {method: 'Put', body: this.editFormGroup.value})
            .subscribe((res) => {
                try {
                    if ((res.errors == 0)) {
                       
                       this.alertService.success(res.msg ? res.msg : 'User has been updated successfully.');
                       this.getUserList();
                       return true;
                    } else {
                        let msg = '';
                         for(var key in res.errors){
                            console.log(key + ' - ' + res.errors[key]);
                            msg = msg + ' <br/>' + res.errors[key];
                        }
                        this.alertService.error(msg ? msg : 'Authentican failed due to some error!');
                    }
                } catch (error) {
                    this.alertService.error(res.message ? res.message : 'Authentican failed due to some error!');
                }
            },
            (error: any) => {
                this.alertService.displayLoader(false);
                this.alertService.error(error.msg ? error.msg : 'Authentican failed due to some error!');
            });
    }


    getUserList() {
        
        this.listView = true;
        this.editView = false;
        this.addView = false;
        this.formSubmitAttempt = false;

        this.alertService.displayLoader(true);
        this.apiService.makeReq('getUsers', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {
                    console.log(res);
                    if (res.errors) {
                        this.isListLoading = false;
                        this.userList = res.data;
                        return true;
                    }
                } catch (error) {
                    //this.authService.isTokenExpired(error);
                }
            },
            (error: any) => {
                //this.authService.isTokenExpired(error);
            });
    }


    editUser(id) {
        var options = { 'method': 'Get', 'urlData': id };
        this.apiService.makeReq('getUsers', options)
            .subscribe((res) => {
                console.log(res);
                this.listView = false;
                this.editView = true;
                try {

                if ((res.data)) {
                    this.userData.firstname = res.data.first_name;
                    this.userData.lastname = res.data.last_name;
                    this.userData.email = res.data.email;
                    this.userData.phonenumber = res.data.mobile;
                    this.userData.client_type = res.data.user_type_id;
                    this.userData.id = res.data.id;
                    this.userData.password = '';
                    this.userData.password_confirmation = '';
                    //this.setValue(res.data);
                    return true;
                }
            } catch (error) {
              //alert("Error");
            }
        },
        (error: any) => {
            this.alertService.displayLoader(false);
        });

    }

    confirmDelete (title, id) {
            swal({
                   title: "Are you sure you want to delete " + title + "?",
                    text: "You will not be able to recover this !",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, keep it'
                  }).then((result) => {
                    if (result.value) {
                      this.deleteUser(id);
                      swal(
                        'Deleted!',
                        'Your imaginary file has been deleted.',
                        'success'
                      )
                   
                    } else if (result.dismiss === swal.DismissReason.cancel) {
                      swal(
                        'Cancelled',
                        'User ' + title + '  is safe',
                        'error'
                      )
                    }
                  })   
        }

    deleteUser(id){
        this.alertService.displayLoader(true);
        var options = { 'method': 'Delete', 'body': { 'id': id, 'currentPage': this.currentPage } };
        this.apiService.makeReq('getUsers', options)
        .subscribe((res) => {
                if ((res.errors.length == 0)) {
                    this.userList = [];
                    this.getUserList();
                    return true;
                }
        },
        (error: any) => {
            this.alertService.displayLoader(false);
        });
    }

    goBack() {
        this.editView = false;
        this.addView = false;
        this.listView = true;
        this.userData = {email: '', firstname: '',lastname: '',name: '', password: '', password_confirmation: '', role: '', language: '', status: '', client_type: '', phonenumber: '', profilepic: '', id: ''};
   }
}
