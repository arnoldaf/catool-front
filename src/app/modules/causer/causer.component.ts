import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
//import {AuthService} from '../../services/auth.service';

@Component({
    selector: '.m-wrapper',
    templateUrl: './causer.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class UserComponent implements AfterViewInit, OnInit {
    addFormGroup: FormGroup;
    editFormGroup: FormGroup;
    listView = true;
    testing = 'this is a test'
    addView = false;
    editView = false;
    userDetail: any = [];
    userList: any = [];
    first_name: any;
    middle_name: any;
    last_name: any;
    user_type_id: any;
    url: any;
    client_code: any;
    email: any;
    mobile: any;
    //password: any;
    password_confirmation: any;
    phone: any;
    personal_email: any;
    address: any;
    city: any;
    state_id: any;
    county_id: any;
    zip_code: any;
    office_address: any;
    office_phone: any;
    gst_number: any;
    pan_number: any;
    adhar_number: any;
    brand_name: any;
    referral_code: any;
    //status: any;

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
    ) {
        // translate.addLangs(['en', 'fr', 'ur']);
    };

    ngOnInit() {

        this.getUserList();
        this.formGenerate();

    }

    ngAfterViewInit() {
        //jQuery('select').material_select();
        //Materialize.updateTextFields();
    }
    docOnClick(event) {
      //  this.registerMsg = false;
    }

    userData =    { first_name: '', middle_name: '', last_name: '', user_type_id: '', url: '', client_code: '',
                  email: '', mobile: '', password: '', password_confirmation: '', phone: '', personal_email: '',
                  address: '', city: '', state_id: '', county_id: '', zip_code: '', office_address: '', office_phone: '' ,
                  gst_number: '', pan_number: '', adhar_number: '', brand_name: '' ,referral_code: '' , status: ''};

    formGenerate() {

        this.addFormGroup = this.fb.group({
            first_name: [this.userData.first_name, [Validators.required]],
            middle_name: [this.userData.middle_name, [Validators.required]],
            last_name: [this.userData.last_name, [Validators.required]],
            user_type_id: [this.userData.user_type_id, [Validators.required]],
            url: [this.userData.url, [Validators.required]],
            client_code: [this.userData.client_code, [Validators.required]],
            email: [this.userData.email, [Validators.required]],
            mobile: [this.userData.mobile, [Validators.required]],
            password: [this.userData.password, [Validators.required]],
            password_confirmation: [this.userData.password_confirmation, [Validators.required]],
            phone: [this.userData.phone, [Validators.required]],
            personal_email: [this.userData.personal_email, [Validators.required]],
            address: [this.userData.address, [Validators.required]],
            city: [this.userData.city, [Validators.required]],
            state_id: [this.userData.state_id, [Validators.required]],
            county_id: [this.userData.county_id, [Validators.required]],
            zip_code: [this.userData.zip_code, [Validators.required]],
            office_address: [this.userData.office_address, [Validators.required]],
            office_phone: [this.userData.office_phone, [Validators.required]],
            gst_number: [this.userData.gst_number, [Validators.required]],
            pan_number: [this.userData.pan_number, [Validators.required]],
            adhar_number: [this.userData.adhar_number, [Validators.required]],
            brand_name: [this.userData.brand_name, [Validators.required]],
            referral_code: [this.userData.referral_code, [Validators.required]],
            status: [this.userData.status, [Validators.required]],
        });
        /*
        this.editFormGroup = this.fb.group({
            email: [this.userData.email, [Validators.required]],
            name: [this.userData.name, [Validators.required]],
            password: [this.userData.password, [Validators.required]],
            password_confirmation: [this.userData.password_confirmation, [Validators.required]],
            role: [this.userData.role, [Validators.required]],
            language: [this.userData.language, [Validators.required]],
            status: [this.selectedStatus, [Validators.required]],
            id: [this.id, [Validators.required]]
        });
        */

    }



    setValue(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
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
    }


    addFormSubmit(data: any): any {

        this.apiService.makeReq('getCaUsers', { method: 'Post', body: this.addFormGroup.value })
            .subscribe((res) => {
                try {

                    if ((res.errors.length == 0) {
                        this.alertService.success('User has been created successfully!');
                        this.getUserList();
                        this.goBack();
                        this.alertService.displayLoader(false);
                        return true;
                    } else {

                        this.alertService.error(res.msg ? res.msg : 'Authentican failed due to some error!');
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

    getUserList() {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('getCaUsers', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {

                    if ((res.errors.length == 0 )) {
                        //this.isListLoading = false;
                        this.userList = res.data;

                        return true;
                    }
                } catch (error) {
                    //this.authService.isTokenExpired(error);
                    //this.alertService.displayLoader(false);
                }
            },
            (error: any) => {
                //this.authService.isTokenExpired(error);
                //this.alertService.displayLoader(false);
            });
    }

    deleteUser(id) {
        this.alertService.displayLoader(true);
        var options = { 'method': 'Delete', 'body': { 'id': id, 'currentPage': this.currentPage } };
        this.apiService.makeReq('getUsers', options)
            .subscribe((res) => {
                try {
                    if ((res.status_code >= 200 && res.status_code < 300)) {
                        this.alertService.success(res.msg ? res.msg : 'Authentican failed due to some error!');
                        this.alertService.displayLoader(false);
                        this.getUserList();
                        return true;
                    }
                } catch (error) {
                    this.alertService.displayLoader(false);
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
        //this.userData = { email: '', firstname: '', lastname: '', name: '', password: '', password_confirmation: '', role: '', language: '', status: '', client_type: '', phonenumber: '', profilepic: '' };
    }
}
