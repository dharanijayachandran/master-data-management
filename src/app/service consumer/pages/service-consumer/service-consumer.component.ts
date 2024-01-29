import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage, globalSharedService } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalService } from 'src/app/shared/globalService';
import { ServiceConsumerServicesService } from '../../services/service-consumer-services.service';

@Component({
  selector: 'app-service-consumer',
  templateUrl: './service-consumer.component.html',
  styleUrls: ['./service-consumer.component.css']
})
export class ServiceConsumerComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'code', 'edit'];
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
  serviceConsumerApplicationId: any;
  noRecordsFound: boolean = true;
  constructor(private ServiceConsumerService: ServiceConsumerServicesService, private globalService: globalSharedService,  private router: Router, private globalServices: globalService) { }

  ngOnInit(): void {
    this.showLoaderImage = true;
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter)
        || data.code.toLowerCase().includes(filter)
    };
    this.getServiceConsumer();
  }

  getServiceConsumer() {
    this.ServiceConsumerService.getServiceConsumer().subscribe(
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

  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  clickToView(element) {
    this.globalServices.viewIcon = true;
    this.globalServices.editPage = false;
    this.globalServices.savePage = false;
    this.globalServices.updateElement = element;
    this.router.navigate(['/consumer-service/serviceConsumerForm']);
  }

  updateServiceConsumerApp(element) {
    this.globalServices.editPage = true;
    this.globalServices.savePage = false;
    this.globalServices.viewIcon = false;
    this.globalServices.updateElement = element;
    this.router.navigate(['/consumer-service/serviceConsumerForm']);
  }

  saveServiceConsumer() {
    this.globalServices.editPage = false;
    this.globalServices.viewIcon = false;
    this.globalServices.savePage = true;
    this.router.navigate(['/consumer-service/serviceConsumerForm']);
  }

  assignServiceConsumerApp(element) {
    this.globalServices.ServiceConsumerElement = element;
    this.router.navigate(['/consumer-service/applications-list']);
  }

  deleteServiceConsumerApplication(elementId) {
    this.serviceConsumerApplicationId = {
      id : elementId
    };
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Service Consumer!');
  }

  confirmDelete() {
    this.ServiceConsumerService.deleteServiceConsumer(JSON.stringify(this.serviceConsumerApplicationId)).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.ngOnInit();
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

}
