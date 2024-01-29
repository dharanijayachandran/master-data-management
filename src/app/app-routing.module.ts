import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccessGroupFormComponent } from './access group/pages/access-group-form/access-group-form.component';
import { AccessGroupListComponent } from './access group/pages/access-group-list/access-group-list.component';
import { AccessGroupPreviewComponent } from './access group/pages/access-group-preview/access-group-preview.component';
import { AccessGroupReadViewComponent } from './access group/pages/access-group-read-view/access-group-read-view.component';
import { AccessGroupViewComponent } from './access group/pages/access-group-view/access-group-view.component';
import { AssetStandardTagComponent } from './asset-standard-tag/asset-standard-tag.component';
import { AssetTypeComponent } from './asset-type/asset-type.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { NotificationGroupFormComponent } from './notification group/pages/notification-group-form/notification-group-form/notification-group-form.component';
import { NotificationGroupListComponent } from './notification group/pages/notification-group-list/notification-group-list.component';
import { NotificationGroupMediaFormComponent } from './notification group/pages/notification-group-media-form/notification-group-media-form.component';
import { NotificationGroupMediaPreviewComponent } from './notification group/pages/notification-group-media-preview/notification-group-media-preview.component';
import { NotificationGroupMediaReadViewComponent } from './notification group/pages/notification-group-media-read-view/notification-group-media-read-view.component';
import { NotificationGroupMediaComponent } from './notification group/pages/notification-group-media/notification-group-media.component';
import { NotificationGroupPreviewComponent } from './notification group/pages/notification-group-preview/notification-group-preview.component';
import { NotificationGroupReadViewComponent } from './notification group/pages/notification-group-read-view/notification-group-read-view.component';
import { NotificationGroupViewComponent } from './notification group/pages/notification-group-view/notification-group-view.component';
import { NotificationGroupComponent } from './notification group/pages/notification-group/notification-group.component';
import { MenuMasterFormComponent } from './pages/menu-config/menu-master-form/menu-master-form.component';
import { MasterMenuViewComponent } from './pages/menu-config/menu-master-view/menu-master-view.component';
import { MenuMasterComponent } from './pages/menu-config/menu-master/menu-master.component';
import { AddmasterServiceComponent } from './pages/service-config/addmaster-service/addmaster-service.component';
import { AddmastermoduleComponent } from './pages/service-config/addmastermodule/addmastermodule.component';
import { MasterModuleViewComponent } from './pages/service-config/master-module-view/master-module-view.component';
import { MasterModuleComponent } from './pages/service-config/master-module/master-module.component';
import { MasterServiceViewComponent } from './pages/service-config/master-service-view/master-service-view.component';
import { MasterServiceComponent } from './pages/service-config/master-service/master-service.component';
import { ModuleComponent } from './pages/service-config/module/module.component';
import { SaveApplicationComponent } from './save-application/save-application.component';
import { AddWebServiceCounsumerAppComponent } from './service consumer app/pages/add-web-service-counsumer-app/add-web-service-counsumer-app.component';
import { AssignServiceConsumerAppComponent } from './service consumer app/pages/assign-service-consumer-app/assign-service-consumer-app.component';
import { ServiceConsumerappPreviewComponent } from './service consumer app/pages/service-consumerapp-preview/service-consumerapp-preview.component';
import { WebServiceCounsumerAppViewComponent } from './service consumer app/pages/web-service-counsumer-app-view/web-service-counsumer-app-view.component';
import { WebServiceCounsumerAppComponent } from './service consumer app/pages/web-service-counsumer-app/web-service-counsumer-app.component';
import { ServiceConsumerComponent } from './service consumer/pages/service-consumer/service-consumer.component';
import { ServiceConsumerFormComponent } from './service consumer/pages/service-consumer-form/service-consumer-form.component';
import { ApplicationComponent } from './service consumer/pages/application/application.component';
import { ApplicationFormComponent } from './service consumer/pages/application-form/application-form.component';
import { LogConfigurationComponent } from './service consumer/pages/log-configuration/log-configuration.component';
import { LogConfigurationFormComponent } from './service consumer/pages/log-configuration-form/log-configuration-form.component';
import { PendingChangesGuard } from 'global';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [

  {
    path: 'menu-master',
    children: [
      {
        path: '',
        component: MenuMasterComponent,
        data: { title: 'Menu' }
      },
      {
        path: 'masterMenuForm',
        component: MenuMasterFormComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: 'serviceapi',
    children: [
      {
        path: '',
        component: ModuleComponent,
        data: { title: 'Service-Config' }
      },
      {
        path: 'add-module',
        component: AddmastermoduleComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'module-view',
        component: MasterModuleViewComponent
      },
      {
        path: 'service-view',
        component: MasterServiceViewComponent
      },
      {
        path: 'add-service',
        component: AddmasterServiceComponent,
        canDeactivate: [PendingChangesGuard]
      },
    ]
  },
  {
    path: 'consumer-app',
    children: [
      {
        path: '',
        component: WebServiceCounsumerAppComponent,
        data: { title: 'Service-Consumer' }
      },
      {
        path: 'serviceConsumerappPreview',
        component: ServiceConsumerappPreviewComponent
      },
      {
        path: 'addWebServiceConsumerApp',
        component: AddWebServiceCounsumerAppComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: 'consumer-service',
    children: [
      {
        path: '',
        component: ServiceConsumerComponent
      },
      {
        path: 'serviceConsumerForm',
        component: ServiceConsumerFormComponent
      },
      {
        path: 'applications-list',
        component: ApplicationComponent
      },
      {
        path: 'applicationForm',
        component: ApplicationFormComponent
      },
      {
        path: 'log-configuration',
        component: LogConfigurationComponent
      },
      {
        path: 'logConfigurationForm',
        component: LogConfigurationFormComponent
      }
    ]
  },
  {
    path: 'notification-group',
    children: [
      {
        path: '',
        component: NotificationGroupComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'addNotificationGroup',
        component: NotificationGroupFormComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: 'access-group',
    children: [
      {
        path: '',
        component: AccessGroupListComponent,
        pathMatch: 'full'
      },
      {
        path: 'addAccessGroup',
        component: AccessGroupFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'previewAccessGroup',
        component: AccessGroupPreviewComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'view/:id',
        component: AccessGroupViewComponent
      },
    ]
  },
  {
    path: 'asset-standard-tag',
    component: AssetStandardTagComponent
  },
  {
    path: 'asset-type',
    component: AssetTypeComponent
  },
  {
    path: 'save-applications',
    component: SaveApplicationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/config' },
  ],
})
export class AppRoutingModule { }

export const masterManagementComponent = [
  MenuMasterComponent,
  MasterMenuViewComponent,
  MasterModuleComponent,
  MasterServiceComponent,
  ModuleComponent,
  WebServiceCounsumerAppViewComponent,
  ServiceConsumerappPreviewComponent,
  AssignServiceConsumerAppComponent,
  AddWebServiceCounsumerAppComponent,
  MenuMasterFormComponent,
  NotificationGroupComponent,
  NotificationGroupListComponent,
  NotificationGroupFormComponent,
  WebServiceCounsumerAppComponent,
  AddmastermoduleComponent,
  MasterModuleViewComponent,
  MasterServiceViewComponent,
  AddmasterServiceComponent,
  NotificationGroupPreviewComponent,
  NotificationGroupReadViewComponent,
  NotificationGroupViewComponent,
  NotificationGroupMediaFormComponent,
  NotificationGroupMediaPreviewComponent,
  NotificationGroupMediaReadViewComponent,
  NotificationGroupMediaComponent,
  AccessGroupListComponent,
  AccessGroupFormComponent,
  AccessGroupPreviewComponent,
  AccessGroupReadViewComponent,
  AccessGroupViewComponent,
  EmptyRouteComponent
];
