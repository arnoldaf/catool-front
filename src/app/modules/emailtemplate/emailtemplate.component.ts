import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
//import {AuthService} from '../../services/auth.service';

import { Helpers } from '../../helpers';
import { ScriptLoaderService } from '../../_services/script-loader.service';


@Component({
    selector: '.m-wrapper',
    templateUrl: './emailtemplate.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class EmailtemplateComponent implements AfterViewInit, OnInit {
    addFormGroup: FormGroup;
    editFormGroup: FormGroup;
    listView = true;
    testing = 'this is a test'
    addView = false;
    editView = false;
    userDetail: any = [];
    templateList: any = [];
    emailGroupList: any = [];
    languages: any = [];
    roles: any = [];
    selectedRole: any;
    selectedLanguage: any;
    selectedStatus: any;
    role_name: any;
    email: any;
    subject: any;
    body: any;
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
        // private authService: AuthService,
        // private router: Router,
        private _script: ScriptLoaderService

    ) {
        // translate.addLangs(['en', 'fr', 'ur']);
        // translate.setDefaultLang('en');

        // const browserLang = translate.getBrowserLang();
        // translate.use(browserLang.match(/en|fr|ur/) ? browserLang : 'en');
    };



    ngOnInit() {
        this.getTemplateList();
        this.getEmailGroupList();
        this.formGenerate();

    }

    ngAfterViewInit() {
        //jQuery('select').material_select();
        //Materialize.updateTextFields();
        this._script.loadScripts('app-header-actions',
            ['assets/demo/default/custom/header/actions.js']);
    }
    docOnClick(event) {
        this.registerMsg = false;
    }

    templateData = { email_subject: '', email_body: '', email_to: '', email_cc: '', email_bcc: ''};

    formGenerate() {

        this.addFormGroup = this.fb.group({
            email_subject: [this.templateData.email_subject, [Validators.required]],
            email_body: [this.templateData.email_body, [Validators.required]],
            email_to: [this.templateData.email_to, [Validators.required]],
            email_cc: [this.templateData.email_cc, [Validators.required]],
            email_bcc: [this.templateData.email_bcc, [Validators.required]],
        });
        /*
        this.editFormGroup = this.fb.group({
            subject: [this.templateData.subject, [Validators.required]],
            body: [this.templateData.body, [Validators.required]],
            to: [this.templateData.to, [Validators.required]],
            cc: [this.templateData.cc, [Validators.required]],
            bcc: [this.templateData.bcc, [Validators.required]]
            id: [this.templateData.id, [Validators.required]]
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


    addTemplate() {
        this.getEmailGroupList();
        this.listView = false;
        this.addView = true;
    }


    addFormSubmit(data: any): any {

        this.apiService.makeReq('emailtemplate', {method: 'Post', body: this.addFormGroup.value })

            .subscribe((res) => {
                try {

                    if (res.errors.length == 0) {
                       this.alertService.success(res.msg ? res.msg : 'Template has been added successfully!');
                       this.getTemplateList();
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

    getTemplateList() {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('emailtemplate', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {
                    console.log(res);
                    if (res.error == null) {
                        this.isListLoading = false;
                        this.templateList = res.data;
                        //this.roles = res.data.roles;
                        //this.languages = res.data.languages;
                        //this.alertService.displayLoader(false);
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
    
    getEmailGroupList() {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('emailgroup', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {
                    console.log(res);
                    if (res.error == null) {
                        this.isListLoading = false;
                        this.emailGroupList = res.data;
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

    deleteTemplate(id) {
        this.alertService.displayLoader(true);
        var options = { 'method': 'Delete', 'body': { 'id': id, 'currentPage': this.currentPage } };
        this.apiService.makeReq('emailtemplate', options)
            .subscribe((res) => {
                try {
                    if ((res.status_code >= 200 && res.status_code < 300)) {
                        this.alertService.success(res.msg ? res.msg : 'Authentican failed due to some error!');
                        this.alertService.displayLoader(false);
                        this.getTemplateList();
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
        this.templateData = { email_subject: '', email_body: '', email_to: '', email_cc: '', email_bcc: ''};
    }
}