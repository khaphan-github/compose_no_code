import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ButtonModule,
  CardModule,
  DropdownModule,
  GridModule,
  ProgressModule,
  SharedModule,
  WidgetModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';


import { WidgetsBrandComponent } from './widgets-brand/widgets-brand.component';
import { WidgetsEComponent } from './widgets-e/widgets-e.component';

@NgModule({
  declarations: [
    WidgetsBrandComponent,
    WidgetsEComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    WidgetModule,
    IconModule,
    DropdownModule,
    SharedModule,
    ButtonModule,
    CardModule,
    ProgressModule,
    ChartjsModule
  ],
  exports: [
    WidgetsBrandComponent,
  ]
})
export class WidgetsModule {
}
