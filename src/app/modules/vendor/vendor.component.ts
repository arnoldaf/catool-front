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
    name: any;
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

    @ViewChild('edit') edit;


    @ViewChild('add') add;


    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private alertService: AlertService,
        private vendorService: VendorService,

    ) {
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

    vendorData = { name: '', gst_number: '', id: ''};

    formGenerate() {
        this.addFormGroup = this.fb.group({
            name: [this.vendorData.name, [Validators.required]],
            gst_number: [this.vendorData.gst_number, [Validators.required]],
        });
         this.editFormGroup = this.fb.group({
            name: [this.vendorData.name, [Validators.required]],
            gst_number: [this.vendorData.gst_number, [Validators.required]],
            id: [this.vendorData.id, [Validators.required]]
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
        this.editView = false;
    }

    addFormSubmit(data: any): any {

        this.apiService.makeReq('vendor', {method: 'Post', body: this.addFormGroup.value })

            .subscribe((res) => {
                try {

                    if (res.errors.length == 0) {
                       this.alertService.success(res.msg ? res.msg : 'Vendor has been added successfully!');
                       this.getVendorList();
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
        
        this.apiService.makeReq('vendor', {method: 'Put', body: this.editFormGroup.value})
            .subscribe((res) => {
                
                try {
                    if ((res.errors == 0)) {
                       
                       this.alertService.success(res.msg ? res.msg : 'VEndor has been updated successfully.');
                       this.getVendorList();
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

    deleteVendor(id){
        this.alertService.displayLoader(true);
        var options = { 'method': 'Delete', 'body': { 'id': id, 'currentPage': this.currentPage } };
        this.apiService.makeReq('vendor', options)
        .subscribe((res) => {
           // alert("Hii");
            //try {
                alert(res.errors.length);
                if ((res.errors.length == 0)) {
                    this.alertService.success('Vendor has been deleted.');
                    this.vendorList = [];
                    this.getVendorList();
                    return true;
                }
           /* } catch (error) {
              this.alertService.displayLoader(false);
            } */
        },
        (error: any) => {
            this.alertService.displayLoader(false);
        });

    }
    
     editVendor(id) {
        var options = { 'method': 'Get', 'urlData': id };
        this.apiService.makeReq('vendor', options)
            .subscribe((res) => {
                console.log(res);
                this.listView = false;
                this.editView = true;
                try {

                if ((res.data)) {
                    this.vendorData.name = res.data.name;
                    this.vendorData.gst_number = res.data.gst_number;
                    this.vendorData.id = res.data.id;
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

    goBack() {
        this.editView = false;
        this.addView = false;
        this.listView = true;
        this.vendorData = { name: '', gst_number: '', id: '' };
    }
}