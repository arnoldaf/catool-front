import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../theme/layouts/layout.module';
import { DefaultComponent } from '../../theme/pages/default/default.component';
import { VendorComponent } from './vendor.component';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': VendorComponent,
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
        VendorComponent,
    ],
})
export class VendorModule {
}