import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Service } from '../../../model/service';
import { HttpClient } from '@angular/common/http';
import { MasterServiceService } from '../../../services/master service/master-service.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
//import { id } from '@swimlane/ngx-datatable/release/utils';


@Component({
  selector: 'app-master-service',
  templateUrl: './master-service.component.html',
  styleUrls: ['./master-service.component.css']
})
export class MasterServiceComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
 // @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  showButtons = true;
  NoRecordsFound = false;
  serviceListView = true;
  serviceFormView = false;
  editable = false;
  viewEditable = true;
  required = false;
  apiurl = environment.baseUrl_MasterDataManagement;
  dataSource: any;
  showLoaderImage = true;
  displayedColumns: string[] = ['id', 'displayName', 'description', 'serviceUrl', 'dataOperation', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) myPaginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  serviceId: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  serviceForm: FormGroup;
   service: Service = new Service();
  addEditText: string;
  serviceFormViewHead: boolean;
  serviceReadModeView: boolean;
  moduleViewHead: boolean;
  moduleName: String;
  deleteMasterService: number;
  deleteServiceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  modeleId: number;
  constructor(private globalService: globalSharedService, private serviceservice: MasterServiceService, private formBuilder: FormBuilder, public tabset: NgbTabset, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.displayName.toLowerCase().includes(filter) || data.description.toLowerCase().includes(filter) || data.dataOperation.toLowerCase().includes(filter);
    };

    this.showLoaderImage = true;
    this.moduleName = this.globalService.listOfRow.name;
    this.getServicesListByModule();
  }
  ngAfterViewInit() {

  }
  getServicesListByModule() {
    this.modeleId = this.globalService.selectedId;
    if (this.modeleId == null) {
      this.modeleId = this.globalService.listOfModulesforServices.id;
    }
    this.getServicesListByModuleId(this.modeleId);
  }

  // Refresh table
  refreshTableListFunction() {
    this.getServicesListByModule();
  }

  updateService(service) {
    this.serviceObject(service);
  }


  // Common function for setting ID and module object
  serviceObject(service) {
    this.globalService.GettingId(service.id);
    this.globalService.setOrganizationDetail('', service);
  }
  // Click to View
  clickToView(serviceDetail) {
    this.globalService.GettingId(serviceDetail.id);
    this.globalService.setOrganizationDetail("service-view", serviceDetail);
  }

  getServicesListByModuleId(id) {
    this.serviceservice.getServiceListByModuleId(id)
      .subscribe(
        res => {
          res.forEach(element => {
            if (!element.description) {
              element.description = '';
            }
          });
          this.showLoaderImage = false;
          //  this.dataSource = new MatTableDataSource();

          this.dataSource.data = Array.isArray(res) && res.length ? res : [];
          this.dataSource.data = this.dataSource.data.sort((a, b) => b.id - a.id);

          // To get paginator events from child mat-table-paginator to access its properties
          // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          // this.matTablePaginator(this.myPaginator);

          this.dataSource.paginator = this.myPaginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });

  }


  deleteService(id: number) {
    this.serviceId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Master Service!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem("userId");
    this.serviceservice.deleteService(this.serviceId, Number(userId)).subscribe(res => {

      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // redirectTo
  redirectTo() {
    this.getServicesListByModuleId(this.modeleId);
  }

  /*
  Material table paginator code starts here
*/
 // myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

}
