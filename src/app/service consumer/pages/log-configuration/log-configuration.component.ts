import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { globalService } from 'src/app/shared/globalService';
import { ScrollbarDirective, UIModalNotificationPage, globalSharedService } from 'global';
import { ServiceConsumerServicesService } from '../../services/service-consumer-services.service';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-log-configuration',
  templateUrl: './log-configuration.component.html',
  styleUrls: ['./log-configuration.component.css']
})
export class LogConfigurationComponent implements OnInit {
  displayedColumns: string[] = ['id', 'logLevel', 'logOutputDestination', 'logRetentionPeriod', 'serviceConsumer', 'serviceConsumerApp', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  dataSource: any;
  NoRecordsFound: boolean;
  showLoaderImage = false;
  sort: any;
  logConfigurationId: any;
  deleteElementId: any;
  constructor(private ServiceConsumerService: ServiceConsumerServicesService, private globalService: globalSharedService, private router: Router, private globalServices: globalService, ) { }

  ngOnInit(): void {
    this.showLoaderImage = true;
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.logLevelId.toLowerCase().includes(filter)
    };
    this.getConfiguration();
  }

  getConfiguration() {
    this.ServiceConsumerService.getLog(this.globalServices.ServiceConsumerElement.id, this.globalServices.serviceConsumerApplicationElement.id).subscribe(
      res => {
        this.showLoaderImage = false;
        let getDataSource = res;
        if (Array.isArray(res) && res.length) {
          getDataSource = getDataSource.sort((a, b) => b.id - a.id);
          this.dataSource.data = getDataSource;
          this.dataSource.paginator = this.myPaginator;
          this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          this.pageIndex = this.myPaginator.pageIndex + 1;
          this.pageSize = this.myPaginator.pageSize;
          this.dataSource.sort = this.sort;
        }
        else {
          this.NoRecordsFound = true;
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  refreshTableListFunction() {
    this.ngOnInit();
  }

  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  clickToView(element) {
    this.globalServices.viewIcon = true;
    this.globalServices.editPage = false;
    this.globalServices.savePage = false;
    this.globalServices.updateElement = element;
    this.router.navigate(['/consumer-service/logConfigurationForm']);
  }

  updateConfiguration(element) {
    this.globalServices.editPage = true;
    this.globalServices.savePage = false;
    this.globalServices.viewIcon = false;
    this.globalServices.updateElement = element;
    this.router.navigate(['/consumer-service/logConfigurationForm']);
  }

  saveConfiguration() {
    this.globalServices.editPage = false;
    this.globalServices.viewIcon = false;
    this.globalServices.savePage = true;
    this.router.navigate(['/consumer-service/logConfigurationForm']);
  }

  deleteConfiguration(elementId) {
    this.deleteElementId = elementId;
    this.logConfigurationId = {
      updatedBy: sessionStorage.getItem("userId")
    };
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Log configuration!');
  }

  confirmDelete() {
    this.ServiceConsumerService.deleteLog(this.logConfigurationId, this.globalServices.ServiceConsumerElement.id, this.globalServices.serviceConsumerApplicationElement.id, this.deleteElementId).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.ngOnInit();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }

  backToApplication() {
    this.router.navigate(['consumer-service/applications-list']);
  }

}
