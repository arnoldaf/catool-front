import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
//import {AuthService} from '../../services/auth.service';

@Component({
    selector: '.m-wrapper',
    templateUrl: './vendor.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class VendorComponent implements AfterViewInit, OnInit {
    addFormGroup: FormGroup;
    editFormGroup: FormGroup;
    listView = true;
    testing = 'this is a test'
    addView = false;
    editView = false;
    vendorDetail: any = [];
    vendorList: any = [];
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
        private vendorService: VendorService,
        // private authService: AuthService,
        // private router: Router,

    ) {
        // translate.addLangs(['en', 'fr', 'ur']);
        // translate.setDefaultLang('en');

        // const browserLang = translate.getBrowserLang();
        // translate.use(browserLang.match(/en|fr|ur/) ? browserLang : 'en');
    };

    ngOnInit() {

        this.getVendorList();
        this.formGenerate();

    }

    ngAfterViewInit() {
        //jQuery('select').material_select();
        //Materialize.updateTextFields();
    }
    docOnClick(event) {
        this.registerMsg = false;
    }

    vendorData = { name: '', gst_number: ''};

    formGenerate() {

        this.addFormGroup = this.fb.group({
            name: [this.vendorData.name, [Validators.required]],
            gst_number: [this.vendorData.gst_number, [Validators.required]],
        });
    }



    setValue(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
        Object.keys(value).forEach(name => {
            if (this.editFormGroup.get(name) && value[name] != '') {
                this.editFormGroup.controls[name].setValue(value[name], { onlySelf: true, emitEvent });
            }
        });
    }


    addVendor() {
        this.listView = false;
        this.addView = true;
        setTimeout(() => {
            // jQuery('select').material_select();
            // Materialize.updateTextFields();
        }, 200);
    }


    addFormSubmit(data: any): any {

        //'Content-Type': 'multipart/form-data'
        //this.alertService.displayLoader(true);
        this.apiService.makeReq('vendor', { method: 'Post', body: this.addFormGroup.value })
            .subscribe((res) => {
                //this.alertService.displayLoader(false);
                try {
                    console.log(res);
                    if ((res.status_code >= 200 && res.status_code < 300) && res.result == true) {
                        this.alertService.success(res.msg ? res.msg : 'Authentican failed due to some error!');
                        this.getVendorList();
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

    getVendorList() {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('vendor', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {
                    
                    if ((res.error == null )) {
                        this.isListLoading = false;
                        this.vendorList = res.data;
                        
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

    deleteVendor(id) {
        this.alertService.displayLoader(true);
        var options = { 'method': 'Delete', 'body': { 'id': id, 'currentPage': this.currentPage } };
        this.apiService.makeReq('getVendors', options)
            .subscribe((res) => {
                try {
                    if ((res.status_code >= 200 && res.status_code < 300)) {
                        this.alertService.success(res.msg ? res.msg : 'Authentican failed due to some error!');
                        this.alertService.displayLoader(false);
                        this.getVendorList();
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
        this.vendorData = { name: '', gst_number: '' };
    }
}