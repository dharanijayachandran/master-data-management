import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { Module } from '../../../model/module';
import { ModuleService } from '../../../services/module/module.service';


@Component({
  selector: 'app-master-module',
  templateUrl: './master-module.component.html',
  styleUrls: ['./master-module.component.css']
})
export class MasterModuleComponent implements OnInit, AfterViewInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
 // @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  showButtons = true;
  editable = true;
  NoRecordsFound = false;
  moduleListView = true;
  moduleFormView = false;
  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'description', 'edit'];
 // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) myPaginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  moduleId: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  moduleForm: FormGroup;
   module: Module = new Module();
  moduleFormViewHead: boolean;
  moduleReadModeView: boolean;
  addEditText: string;
  moduleViewHead: boolean;
  moduleArray: Module[] = [];
  deleteMasterModule: number;
  deleteServiceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  showLoaderImage = true;
  constructor(private globalService: globalSharedService, private moduleService: ModuleService, private formBuilder: FormBuilder, public tabset: NgbTabset, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.description.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.getModules();
  }
  ngAfterViewInit() {

  }

  // Refresh table
  refreshTableListFunction() {
    this.getModules();
  }



  updateModule(moduleDetail) {
    this.moduleObject(moduleDetail);
  }

  // Click to View
  clickToView(consumerDetail) {
    this.globalService.GettingId(consumerDetail.id);
    this.globalService.setOrganizationDetail("module-view", consumerDetail);
  }
  // Common function for setting ID and module object
  moduleObject(moduleDetail) {
    this.globalService.GettingId(moduleDetail.id);
    this.globalService.setOrganizationDetail('', moduleDetail);
  }

  @Output() tabName = new EventEmitter<string>();

  viewServiceListByModuleId(moduleDetail) {
    this.globalService.listOfModulesforServices = moduleDetail;
    this.globalService.GettingId(moduleDetail.id);
    //sessionStorage.setItem('webServiceModuleId', JSON.stringify(moduleDetail.id));
    this.globalService.setOrganizationDetail('', moduleDetail);
    this.tabName.emit('mngService');
    let assignService = document.getElementById('mngService');
    assignService.click();
  }

  getModules() {
    this.moduleService.getModuleList()
      .subscribe(
        res => {
          res.forEach(module => {
            if (!module.description) {
              module.description = '';
            }
          })
          this.showLoaderImage = false;
          // this.dataSource = new MatTableDataSource();
          this.globalService.listOfRow = res;
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
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  deleteModule(id: number) {
    this.moduleId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Master Module!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem("userId");
    this.moduleService.deleteModule(this.moduleId, Number(userId)).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // Redirect to
  redirectTo() {
    this.getModules();
  }

  /*
  Material table paginator code starts here
*/
  //myPaginator;
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


