import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {LayoutModule} from '../../theme/layouts/layout.module';
import {DefaultComponent} from '../../theme/pages/default/default.component';
import {EmailtemplateComponent} from './emailtemplate.component';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    'path': '',
    'component': DefaultComponent,
    'children': [
      {
        'path': '',
        'component': EmailtemplateComponent ,
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
    EmailtemplateComponent,
  ],
})
export class EmailtemplateModule {
}