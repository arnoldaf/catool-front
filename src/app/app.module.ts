import { BrowserModule } from '@angular/platform-browser';
//import { NgModule } from '@angular/core';
import {NgModule, InjectionToken} from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { AppHttpService } from './_services/app-http.service';
import { AsideNavService } from "./_services/aside-nav.service";

import {AlertService} from './services/alert.service';
import {ApiService} from './services/api.service';
//import {AlertComponent} from './directives/alert/alert.component';
//import {LoaderComponent} from './directives/loader/loader.component';
//import {ConfirmComponent} from './directives/confirm/confirm.component';
//import {AuthGuard} from './guards/auth.guard';
//import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {VendorService} from './services/vendor.service';
import {VendorBillingService} from './services/vendorbilling.service';
import {LocalStorageService} from './services/local-storage.service';
import {ArticleService} from './services/article.service';
import {FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';

import {AppConfigModule} from './config/app-config.module';


@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        AppConfigModule,
        FormsModule,
    ],
    providers: [
        ScriptLoaderService,
        AsideNavService,
        AlertService,
        ApiService,
        //AuthService,
        //AuthGuard,
        UserService,
		VendorService,
		VendorBillingService,
        LocalStorageService,
        AppHttpService,
        ArticleService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
