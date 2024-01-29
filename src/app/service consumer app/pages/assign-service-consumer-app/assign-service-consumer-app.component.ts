import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { Module } from '../../../model/module';
import { Service } from '../../../model/service';
import { ModuleService } from '../../../services/module/module.service';
import { ServiceConsumerApp } from '../../model/serviceCounsumerApp';
import { WebServiceAccess } from '../../model/WebServiceAccess';
import { AssignWebServiceAccessService } from '../../services/AssignWebServiceAccess/assign-web-service-access.service';


@Component({
  selector: 'app-assign-service-consumer-app',
  templateUrl: './assign-service-consumer-app.component.html',
  styleUrls: ['./assign-service-consumer-app.component.css'],
  providers: [DatePipe]
})
export class AssignServiceConsumerAppComponent implements OnInit {
  CheckedCheckbox: boolean = false;
  showLoaderImage: boolean = false;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.assignedServiceConsumerForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  webServiceConsumerAppListView = true;
  displayedColumns: string[] = ['id', 'name', 'serviceUrl', 'select'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  pageSize: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  dataSource;
  serviceConsumerApp: ServiceConsumerApp;
  modules: any[] = [];
  webservices: Service[] = [];
  assignedServiceConsumerForm: FormGroup;
  NoRecordsFound = false;
  selection = new SelectionModel<WebServiceAccess>(true, []);
  serviceConsumerView = false;
  id: number;
  serviceMessage: string;
  dynamicRedirection: string;
  isAssign = false;
  warningFlag: string;


  public ModuleFields: Object = {
    text: 'name',
    value: 'id'
  };
   // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.modules, query);
  }
  public sortDropdown:string ='Ascending';
  moduleId:any;
  // set the placeholder to DropDownList input element
  public moduleWaterMark: string = 'Select module';

  // set the placeholder to filter search box input element
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public locale: string;
  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService, private moduleService: ModuleService, private assignWebServiceAccessService: AssignWebServiceAccessService, private router: Router, private datepipe: DatePipe,
    private dialogService: DialogService) { }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.displayName.toLowerCase().includes(filter) || data.name.toLowerCase().includes(filter);
    };
    this.assignwebServiceConsumerForm();
    this.getModules();
    this.id = this.globalService.selectedId;
    this.getServicesListByModuleId(0);
    this.serviceConsumerApp = this.globalService.listOfRow;
  }

  // Refresh
  refreshTableListFunction() {
    this.assignwebServiceConsumerForm();
    this.getModules();
    this.getServicesListByModuleId(0);
  }

  assignwebServiceConsumerForm() {
    this.assignedServiceConsumerForm = this.formBuilder.group({
      moduleId: [0],
      assigned: []
    });
  }
  getModules() {
    this.moduleService.getModuleList()
      .subscribe(
        res => {
          this.modules = res;
          this.modules=this.modules.filter(module=>module.status ==="Active")
          this.modules= this.globalService.addSelectIntoList(this.modules);
          this.globalService.setIcons(this.modules);
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  public onChange(event: any): void {  // event will give you full breif of action
    if(event.value){
      let selectedValue = +event.itemData.id;
      this.getServicesListByModuleId(selectedValue);
    }else{
      this.assignedServiceConsumerForm.controls['moduleId'].setValue(null);
      this.getServicesListByModuleId(0);
    }
  }


  getServicesListByModuleId(moduleId: number) {
    this.showLoaderImage = true;
    this.assignWebServiceAccessService.getServicesByModuleId(moduleId, this.id)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          if (Array.isArray(res) && res.length) {
            this.webservices = res;
            this.dataSource.data = res;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource.data = this.webservices;
            this.updateCheckboxStatus(this.dataSource.data);
            this.isAssign = false;
            this.serviceConsumerView = true;
            this.NoRecordsFound = false;
          }
          else {
            this.webservices = [];
            this.dataSource.data = []
            this.NoRecordsFound = true;
            this.serviceConsumerView = false;
          }
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });

  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: WebServiceAccess): string {
    if (!row) {
      let row = `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      return row;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  hasCheckedCheckbo() {
    this.CheckedCheckbox = true;
  }

  // This method used to update checkbox status when it's loaded into the view
  updateCheckboxStatus(nodes) {
    let checkedNodes = nodes.filter((e) => e.isAssigned);
    this.selection = new SelectionModel(true, checkedNodes);
  }
  assinWebServiceConsumer() {
    this.showLoaderImage = true;
    let d = new Date();
    let latest_date = this.datepipe.transform(d, 'yyyy-MM-dd');
    let service = <WebServiceAccess>this.assignedServiceConsumerForm.value;
    let services = [];
    this.selection.selected.forEach(data => {
      let serviceObj: WebServiceAccess = new WebServiceAccess();
      serviceObj.webServiceModuleId = service.moduleId;
      serviceObj.serviceConsumerAppId = this.id;
      serviceObj.accessFrom = latest_date.toString();
      serviceObj.dataOperation = data.dataOperation,
        serviceObj.webServiceId = data.id
      services.push(serviceObj);
    });
    this.assignWebServiceAccessService.assignServiceAccessToConsumerApp(services).subscribe((res) => {
      this.showLoaderImage = false;
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // redirectTo
  redirectTo() {
    this.router.navigate([this.dynamicRedirection]);
  }

  public onClick(isChecked) {
    if (isChecked.checked) {
      let isAssigned = false;
      let listservices: Service[] = [];
      this.webservices.forEach(element => {
        if (element.isAssigned != isAssigned) {
          listservices.push(element);
        }
      });
      if (listservices.length != 0) {
        this.dataSource.data = listservices
      } else {
        this.dataSource.data = [];
        this.NoRecordsFound = true;
      }
      this.isAssign = true;
    }
    else {
      if (this.webservices.length != 0) {
        this.dataSource.data = this.webservices;
        this.NoRecordsFound = false;
      } else {
        this.dataSource.data = []
        this.NoRecordsFound = true;
      }


    }
  }

  // Reset webserviceconsumer form
  resetAssignedWebServiceConsumerForm() {
    if (this.CheckedCheckbox == true) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formResetConfirm();
    }
  }

  // Form reset  confirm
  formResetConfirm() {
    let service = <WebServiceAccess>this.assignedServiceConsumerForm.value;
    if (service.id === null || service.webServiceModuleId === 0) {
      this.assignwebServiceConsumerForm();
      this.getServicesListByModuleId(0);
      this.CheckedCheckbox = false;
    }
    else {
      this.assignwebServiceConsumerForm();
      this.getServicesListByModuleId(service.moduleId);
      this.CheckedCheckbox = false;
    }
  }

  cancelAssignedWebServiceConsumerForm(event: Event) {
    if (this.CheckedCheckbox == true) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  formCancelConfirm() {
    this.assignedServiceConsumerForm.reset();
    let consumerApp = document.getElementById("consumerApp");
    consumerApp.click();
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }
}
