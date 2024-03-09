import { ManageAuthModule } from './views/manage-auth/manage-auth.module';
import { NgModule, OnInit, inject } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgScrollbarModule } from 'ngx-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  SpinnerModule,
  TabsModule,
  ToastModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInterceptor } from './core/web-api/interceptor';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CustomToartComponent } from './views/shared/custom-toart/custom-toart.component';
import { QueryParamKeyMapDirective } from './views/shared/directive/query-param-key-map.directive';
import { UpdateFormComponent } from './views/update-form/update-form.component';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

const INTERATED_MODULE = [
  ManageAuthModule,
  CustomToartComponent,
]

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, UpdateFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    SpinnerModule,
    NgScrollbarModule,
    ...INTERATED_MODULE
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js')
      }
    },

    IconSetService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  private appService = inject(AppService);
  private route = inject(Router);

  ngOnInit(): void {
    if (!this.appService.isValidSecretKey()) {
      this.route.navigate(['login']);
    }
  }
}
