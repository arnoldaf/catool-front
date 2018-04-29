import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../theme/layouts/layout.module';
import { DefaultComponent } from '../../theme/pages/default/default.component';
import { VendorBillingComponent } from './vendorbilling.component';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': VendorBillingComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,
        FormsModule,
        ReactiveFormsModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        VendorBillingComponent,
    ],
})
export class VendorBillingModule {
}