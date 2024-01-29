import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { GlobalModule, PendingChangesGuard } from 'global';
import { AppRoutingModule, masterManagementComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainInterceptor } from './main-interceptor';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { MatSortModule } from '@angular/material/sort';
import { AssetStandardTagComponent } from './asset-standard-tag/asset-standard-tag.component';
import { AssetTypeComponent } from './asset-type/asset-type.component';
import { SaveApplicationComponent } from './save-application/save-application.component';
import { ServiceConsumerComponent } from './service consumer/pages/service-consumer/service-consumer.component';
import { ServiceConsumerFormComponent } from './service consumer/pages/service-consumer-form/service-consumer-form.component';
import { ApplicationComponent } from './service consumer/pages/application/application.component';
import { ApplicationFormComponent } from './service consumer/pages/application-form/application-form.component';
import { LogConfigurationComponent } from './service consumer/pages/log-configuration/log-configuration.component';
import { LogConfigurationFormComponent } from './service consumer/pages/log-configuration-form/log-configuration-form.component';
import { MatTablePaginatorComponent } from './shared/components/mat-table-paginator/mat-table-paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    MatTablePaginatorComponent,
    masterManagementComponent,
    AssetStandardTagComponent,
    AssetTypeComponent,
    SaveApplicationComponent,
    ServiceConsumerComponent,
    ServiceConsumerFormComponent,
    ApplicationComponent,
    ApplicationFormComponent,
    LogConfigurationComponent,
    LogConfigurationFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTreeModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    AngularDualListBoxModule,
    GlobalModule,
    DropDownListModule,
    DropDownTreeModule,
    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Title, {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    PendingChangesGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check-indeterminate', color: 'primary' } as MatCheckboxDefaultOptions }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
