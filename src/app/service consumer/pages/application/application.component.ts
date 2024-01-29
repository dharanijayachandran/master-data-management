import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage, globalSharedService } from 'global';
import { globalService } from 'src/app/shared/globalService';
import { ServiceConsumerServicesService } from '../../services/service-consumer-services.service';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'code', 'appCategory', 'serviceConsumerName', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  dataSource: any;
  // NoRecordsFound: boolean;
  showLoaderImage = false;
  sort: any;
  ApplicationId: any;
  totalNoOfRecords = 0;
  applicationId: any;
  constructor(private ServiceConsumerService: ServiceConsumerServicesService, private globalService: globalSharedService, private router: Router, private globalServices: globalService) { }

  ngOnInit(): void {
    this.showLoaderImage = true;
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter)
        || data.code.toLowerCase().includes(filter)
    };
    this.getApplications();
  }

  getApplications() {
    this.ServiceConsumerService.getApplication(this.globalServices.ServiceConsumerElement.id).subscribe(
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
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = [];
          // this.NoRecordsFound = true;
        }
      },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  refreshTableListFunction() {
    this.ngOnInit();
  }

  clickToView(element) {
    this.globalServices.viewIcon = true;
    this.globalServices.editPage = false;
    this.globalServices.savePage = false;
    this.globalServices.updateElement = element;
    this.router.navigate(['/consumer-service/applicationForm']);
  }

  updateApplication(element) {
    this.globalServices.editPage = true;
    this.globalServices.savePage = false;
    this.globalServices.viewIcon = false;
    this.globalServices.updateElement = element;
    this.router.navigate(['/consumer-service/applicationForm']);
  }

  saveApplication() {
    this.globalServices.editPage = false;
    this.globalServices.viewIcon = false;
    this.globalServices.savePage = true;
    this.router.navigate(['/consumer-service/applicationForm']);
  }

  logConfiguration(element) {
    this.globalServices.serviceConsumerApplicationElement = element;
    this.router.navigate(['/consumer-service/log-configuration']);
  }

  deleteApplication(elementId) {
    this.applicationId = elementId;
    this.ApplicationId = {
      updatedBy: sessionStorage.getItem("userId")
    }
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Application!');
  }

  confirmDelete() {
    this.ServiceConsumerService.deleteApplication(this.ApplicationId, this.globalServices.ServiceConsumerElement.id, this.applicationId).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.getApplications();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // Material pagination getting pageIndex, pageSize, length through events(On change page, Next,Prev, Last, first)
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }

  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  backToConsumer() {
    this.router.navigate(['/', 'consumer-service']);
  }

}
