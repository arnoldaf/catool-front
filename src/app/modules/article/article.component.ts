import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleService } from '../../services/article.service';

import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { Helpers } from '../../helpers';
import { ScriptLoaderService } from '../../_services/script-loader.service';
//import {AuthService} from '../../services/auth.service';

@Component({
    selector: '.m-wrapper',
    templateUrl: './article.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class ArticleComponent implements AfterViewInit, OnInit {
    addFormGroup: FormGroup;
    editFormGroup: FormGroup;
    topicList: any = [];
    articleList: any = [];
    listView = true;
    addView = false;
    editView = false;
    errorMsg: any;
    currentPage = 0;
    articleTopicId: any;
    otherTopic: any;
    title: any;
    description: any;
    spentHrs: any;
    addOtherTopic = false;
    files: File = null;
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
        private articleService: ArticleService,
        private _script: ScriptLoaderService
    ) {
        // translate.addLangs(['en', 'fr', 'ur']);
    };

    ngOnInit() {
        this.getArticleList();
        this.formGenerate();
    }
    ngAfterViewInit() {
        //this._script.loadScripts('.m-wrapper', ['assets/app/js/article.js']);
    }

    dataTableInit(){
      this._script.loadScripts('.m-wrapper', ['assets/app/js/article.js']);
    }

    docOnClick(event) {

    }

    handleFileInput(files) {
      //console.log(files);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.files = e.target.result;
        //this.addFormGroup.patchValue({files: e.target.result});
      };
      this.addFormGroup.patchValue({files: reader.readAsDataURL(files[0])});
    }

    articleData =    { articleTopicId: '', otherTopic: '', title: '', description: '',  spentHrs: ''};

    formGenerate() {
        this.addFormGroup = this.fb.group({
            title: [this.articleData.title, [Validators.required]],
            spentHrs: [this.articleData.spentHrs, [Validators.required]],
            articleTopicId: [this.articleData.articleTopicId],
            otherTopic: [this.articleData.otherTopic],
            description: [this.articleData.description],
            files: [{}]
        });

    }

    setValue(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
        Object.keys(value).forEach(name => {

        });
    }

    getTopicList() {
      this.apiService.makeReq('articles_topics', { method: 'Get'}).subscribe((res) => {
        try {
            if (res.errors.length == 0 ) {
              this.topicList = res.data;
            }
        } catch (error) {

        }
      });
    }

    addArticle() {
      // to get all topics
      this.getTopicList();
      this.listView = false;
      this.addView = true;
      this.editView = false;
    }

    addFormSubmit(data: any): any {
        this.apiService.makeReq('articles', { method: 'Post', body: this.addFormGroup.value })
            .subscribe((res) => {
                try {
                    if (res.errors.length == 0) {
                        this.alertService.success('Article has been posted successfully.');
                        this.getArticleList();
                        this.goBack();
                        this.alertService.displayLoader(false);
                        //data.reset();
                        return true;
                    } else {
                       this.showErrorMsg(res);
                    }
                } catch (error) {
                     this.showErrorMsg(res);
                }
            },
            (error: any) => {
                this.alertService.displayLoader(false);
                this.alertService.error(error.msg ? error.msg : 'Authentican failed due to some error!');
            });
    }

    getArticleList() {
        this.alertService.displayLoader(true);
        this.apiService.makeReq('articles', { method: 'Get', 'currentPage': this.currentPage })
            .subscribe((res) => {
                try {
                    if ((res.errors.length == 0 )) {
                        this.articleList = res.data;
                        this.dataTableInit();
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

    deleteArticle(id) {


    }

    editArticle(id) {



       }

    goBack() {
        this.editView = false;
        this.addView = false;
        this.listView = true;
    }

    selectOther(args) {
       if (args.target.value == 0) {
          this.addOtherTopic = true;
       } else {
         this.addOtherTopic = false;
       }
    }

    showErrorMsg(res) {
      let errorMsg = '';
      for(var key in res.errors){
         errorMsg += ' <br/>' + res.errors[key];
     }
      this.alertService.error(errorMsg);
    }
}
