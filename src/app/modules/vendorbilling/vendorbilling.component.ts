import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorBillingService } from '../../services/vendorbilling.service';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
//import {AuthService} from '../../services/auth.service';

@Component({
    selector: '.m-wrapper',
    templateUrl: './vendorbilling.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class VendorBillingComponent implements AfterViewInit, OnInit {
    addFormGroup: FormGroup;
    editFormGroup: FormGroup;
    listView = true;
    testing = 'this is a test'
    addView = false;
    editView = false;
    vendorBillingDetail: any = [];
    vendorBillingList: any = [];
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
        private vendorBillingService: VendorBillingService,
        // private authService: AuthService,
        // private router: Router,

    ) {
        // translate.addLangs(['en', 'fr', 'ur']);
        // translate.setDefaultLang('en');

        // const browserLang = translate.getBrowserLang();
        // translate.use(browserLang.match(/en|fr|ur/) ? browserLang : 'en');
    };

    ngOnInit() {

        this.getVendorBillingList();
        this.formGenerate();

    }

    ngAfterViewInit() {
        //jQuery('select').material_select();
        //Materialize.updateTextFields();
    }
    docOnClick(event) {
        this.registerMsg = false;
    }

    vendorBillingData = { bill_date: '', bill_amount: '', gst_amount: '', tax_amount: ''};

    formGenerate() {

        this.addFormGroup = this.fb.group({
            bill_date: [this.vendorBillingList.bill_date, [Validators.required]],
            bill_amount: [this.vendorBillingList.bill_amount, [Validators.required]],
			 gst_amount: [this.vendorBillingList.gst_amount, [Validators.required]],
			  tax_amount: [this.vendorBillingList.tax_amount, [Validators.required]],
        });
    }



    setValue(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
        Object.keys(value).forEach(name => {
            if (this.editFormGroup.get(name) && value[name] != '') {
                this.editFormGroup.controls[name].setValue(value[name], { onlySelf: true, emitEvent });
            }
        });
    }


    addVendorBilling() {
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
        this.apiService.makeReq('vendorBilling', { method: 'Post', body: this.addFormGroup.value })
            .subscribe((res) => {
                //this.alertService.displayLoader(false);
                try {
                    console.log(res);
                    if ((res.status_code >= 200 && res.status_code < 300) && res.result == true) {
                        this.alertService.success(res.msg ? res.msg : 'Authentican failed due to some error!');
                        this.getVendorBillingList();
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

    getVendorBillingList() {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('vendorBilling', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {
                    
                    if ((res.error == null )) {
                        this.isListLoading = false;
                        this.vendorBillingList = res.data;
                        
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

    deleteVendorBilling(id) {
        this.alertService.displayLoader(true);
        var options = { 'method': 'Delete', 'body': { 'id': id, 'currentPage': this.currentPage } };
        this.apiService.makeReq('vendor', options)
            .subscribe((res) => {
                try {
                    if ((res.status_code >= 200 && res.status_code < 300)) {
                        this.alertService.success(res.msg ? res.msg : 'Authentican failed due to some error!');
                        this.alertService.displayLoader(false);
                        this.getVendorBillingList();
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
        this.vendorBillingData = { bill_date: '', bill_amount: '', gst_amount: '', tax_amount: '' };
    }
}