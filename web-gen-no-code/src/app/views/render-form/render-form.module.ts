import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderFormComponent } from './render-form.component';
import { Routes, RouterModule } from '@angular/router';
import {
  CardModule,
  BadgeModule,
  TableModule,
  GridModule,
  ButtonModule,
  DropdownModule,
  ModalModule,
  FormCheckComponent,
  FormModule,
  AlertModule,
  CalloutModule,
  PaginationModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HighlightModule } from 'ngx-highlightjs';
import { InputFieldComponent } from '../manage-auth/components/custom-api/input-field/input-field.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { WaitingToLoadComponent } from '../shared/waiting-to-load/waiting-to-load.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { CopyToClipboardDirective } from './directive/copy.directive';

const UI_MODULES = [
  IconModule,
  CardModule,
  BadgeModule,
  TableModule,
  GridModule,
  ButtonModule,
  DropdownModule,
  ModalModule,
  FormCheckComponent,
  FormModule,

  NotFoundComponent,
  WaitingToLoadComponent,
  AlertModule,
  CalloutModule,

  HighlightModule,

  InputFieldComponent,
  TableModule,
  FormsModule,
  ReactiveFormsModule,
  PaginationModule,

];
const routes: Routes = [
  {
    path: ':id',
    component: RenderFormComponent,
  },
];

export const RenderFormRoutes = RouterModule.forChild(routes);

@NgModule({
  imports: [
    CommonModule,
    DynamicTableComponent,
     ...UI_MODULES,
    RenderFormRoutes,
    CopyToClipboardDirective,
  ],
  declarations: [
    RenderFormComponent,
  ],
})
export class RenderFormModule {}
