import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WebServiceConsumerService } from '../../services/web service consumer/web-service-consumer.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';


@Component({
  selector: 'app-web-service-counsumer-app-view',
  templateUrl: './web-service-counsumer-app-view.component.html',
  styleUrls: ['./web-service-counsumer-app-view.component.css']
})
export class WebServiceCounsumerAppViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
//  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  webServiceConsumerAppListView = true;
  webServiceConsumerAppFormView = false;
  displayedColumns: string[] = ['id', 'name', 'key', 'password', 'status', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) myPaginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  serviceConsumerApplicationId: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  dataSource: MatTableDataSource<unknown>;
  NoRecordsFound: boolean;
  deleteServiceConsumer: number;
  deleteServiceMessage: string;
  alertSuccess = false;
  alertDelete = false;
  confirmAlert = false;
  showLoaderImage = false;
  constructor(private webServiceConsumerService: WebServiceConsumerService, private globalService: globalSharedService) { }

  ngOnInit() {

    this.showLoaderImage = true;
    this.getServiceConsumerApplications();
  }

  // Refresh table
  refreshTableListFunction() {
    this.getServiceConsumerApplications();
  }

  updateServiceConsumerApp(consumerObject) {
    this.consumerObject(consumerObject);
  }

  // Common function for setting ID and module object
  consumerObject(consumerObject) {
    this.globalService.GettingId(consumerObject.id);
    this.globalService.setOrganizationDetail('', consumerObject);
  }


  @Output() tabName = new EventEmitter<string>();

  assignServiceConsumerApp(consumerDetail) {
    this.tabName.emit('assignService');
    this.globalService.GettingId(consumerDetail.id);
    this.globalService.setOrganizationDetail('', consumerDetail);
    let assignService = document.getElementById('assignService');
    assignService.click();
  }

  // Click to View
  clickToView(consumerDetail) {
    this.globalService.GettingId(consumerDetail.id);
    this.globalService.setOrganizationDetail("serviceConsumerappPreview", consumerDetail);
  }
  getServiceConsumerApplications() {
    this.webServiceConsumerService.getServiceConsumerApps()
      .subscribe(
        res => {
          this.showLoaderImage = false;
          let getDataSource = res;
          if (Array.isArray(res) && res.length) {
            getDataSource = getDataSource.sort((a, b) => b.id - a.id);
            this.dataSource = new MatTableDataSource();
            this.dataSource.data = getDataSource;

            // To get paginator events from child mat-table-paginator to access its properties
            // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
            // this.matTablePaginator(this.myPaginator);

            this.dataSource.paginator = this.myPaginator;
            this.dataSource.sort = this.sort;
          }
          else {
            this.NoRecordsFound = true;
          }
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }


  deleteServiceConsumerApplication(id: number) {
    this.serviceConsumerApplicationId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Consumer Application!');
  }


  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem("userId");
    this.webServiceConsumerService.deleteServiceConsumerApp(Number(userId), this.serviceConsumerApplicationId).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  // redirectTo
  redirectTo() {
    this.getServiceConsumerApplications();
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
