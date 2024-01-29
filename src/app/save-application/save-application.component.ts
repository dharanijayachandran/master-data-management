import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplicationServiceService } from './services/application-service.service'
import { globalSharedService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTableDataSource } from '@angular/material/table';
import { MatTablePaginatorComponent } from '../shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-save-application',
  templateUrl: './save-application.component.html',
  styleUrls: ['./save-application.component.css']
})
export class SaveApplicationComponent implements OnInit {
  displayPage: string;
  heading: string;
  viewHeading: string;
  dataSource: any;
  validation: boolean = false;
  saveObject;
  editObject;
  @ViewChild(UIModalNotificationPage) modelNotification;

  showLoaderImage: boolean;

  displayedColumns: string[] = ['id', 'name', 'code', 'action'];

  @ViewChild('nameId') nameId: ElementRef = null;
  @ViewChild('codeId') codeId: ElementRef = null;
  @ViewChild('descriptionId') descriptionId: ElementRef = null;
  @ViewChild('thumbnailId') thumbnailId: ElementRef = null;
  @ViewChild('URLId') URLId: ElementRef = null;

  reviewName = null;
  reviewCode = null;
  reviewDescription = null;
  reviewThumbnail = null;
  reviewURL = null
  warningFlag: string;
  elementId: any;
  deleteElementDetails: any;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  PreviewHeading: boolean;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  disableButtons: boolean;
  constructor(private ApplicationServiceService: ApplicationServiceService, private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.displayPage = 'applicationTable';
    this.validation = false;
    this.showLoaderImage = true;
    this.getApplications();
    this.heading = '';
    this.PreviewHeading = false;
  }

  addApplication() {
    this.disableButtons = true;
    this.displayPage = 'applicationForm';
    this.heading = 'Add';
    this.viewHeading = 'View And save Application'
    this.validation = false;
    this.reviewName = null;
    this.reviewCode = null;
    this.reviewDescription = null;
    this.reviewThumbnail = null;
    this.reviewURL = null;
  }

  viewElement(element) {
    this.heading = 'View';
    this.PreviewHeading = false;
    this.displayPage = 'reviewAndSave';
    this.viewHeading = 'View Application'
    this.reviewName = element.name;
    this.reviewCode = element.code;
    this.reviewDescription = element.description;
    this.reviewThumbnail = element.thumbnail;
    this.reviewURL = element.application_url;
  }

  editElement(element) {
    this.heading = 'Edit';
    this.viewHeading = 'View And save Application'
    this.displayPage = 'applicationForm';
    this.reviewName = element.name;
    this.reviewCode = element.code;
    this.reviewDescription = element.description;
    this.reviewThumbnail = element.thumbnail;
    this.reviewURL = element.application_url;
    this.elementId = element.id;
  }

  deleteElement(element) {
    this.deleteElementDetails = {
      id: element.id,
      code: element.code,
      name: element.name,
      description: element.description,
      status: 'A',
      application_url: element.application_url,
      thumbnail: element.thumbnail
    }

    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Type !');
  }

  confirmDelete() {
    this.ApplicationServiceService.deleteApplication(JSON.stringify(this.deleteElementDetails)).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.ngOnInit();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  reviewAndSave() {
    this.PreviewHeading = true;
    this.reviewName = this.nameId.nativeElement.value;
    this.reviewCode = this.codeId.nativeElement.value;
    this.reviewDescription = this.descriptionId.nativeElement.value;
    this.reviewThumbnail = this.thumbnailId.nativeElement.value;
    this.reviewURL = this.URLId.nativeElement.value;

    if (!this.validation) {
      this.displayPage = 'reviewAndSave';
    }
  }

  reviewAndSaveValidationError() {
    if (this.nameId.nativeElement.value === '' || this.codeId.nativeElement.value === '' ||
      this.nameId.nativeElement.value === undefined || this.codeId.nativeElement.value === undefined) {
      this.validation = true;
      setTimeout(() => { this.validation = false }, 2000);
    }
    else {
      this.validation = false;
    }
  }

  disableCancelReset(state) {
    if (state === 'disable') {
      this.disableButtons = true;
    }
    else if (state === 'enable') {
      this.disableButtons = false;
    }
  }

  reviewAndSaveValidation() {
    this.saveObject = {
      name: this.nameId.nativeElement.value,
      description: this.descriptionId.nativeElement.value,
      thumbnail: this.thumbnailId.nativeElement.value,
      code: this.codeId.nativeElement.value,
      application_url: this.URLId.nativeElement.value,
      status: "A"
    }

    this.editObject = {
      id: this.elementId,
      name: this.nameId.nativeElement.value,
      description: this.descriptionId.nativeElement.value,
      thumbnail: this.thumbnailId.nativeElement.value,
      code: this.codeId.nativeElement.value,
      application_url: this.URLId.nativeElement.value,
      status: "A"
    }

    if (this.nameId.nativeElement.value === '' || this.codeId.nativeElement.value === '' ||
      this.nameId.nativeElement.value === undefined || this.codeId.nativeElement.value === undefined) {
      this.validation = true;
      setTimeout(() => { this.validation = false }, 2000);
    }
    else {
      this.validation = false;
      this.reviewAndSave();
    }
  }

  cancel() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  reset() {
    if (this.heading === 'Add') {
      this.reviewName = null;
      this.reviewCode = null;
      this.reviewDescription = null;
      this.reviewThumbnail = null;
      this.reviewURL = null;
    }
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  back() {
    this.PreviewHeading = false;
    if (this.heading === 'Edit') {
      this.heading = 'Edit';
    }
    else if (this.heading === 'Add'){
      this.heading = 'Add';
    }
    else {
      this.heading = '';
    }
    if (this.viewHeading == 'View And save Application') {
      this.displayPage = "applicationForm";
    }
    else {
      this.ngOnInit();
    }
    this.validation = false;
  }

  save() {
    this.PreviewHeading = false;
    if (this.heading === 'Add') {
      this.ApplicationServiceService.saveApplication(JSON.stringify(this.saveObject)).subscribe(res => {
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.ngOnInit();
      },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
    else if (this.heading === 'Edit') {
      this.ApplicationServiceService.editApplication(JSON.stringify(this.editObject)).subscribe(res => {
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.ngOnInit();
      },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
    this.ngOnInit();
  }

  getApplications() {
    this.ApplicationServiceService.getApplications().subscribe(res => {
      this.showLoaderImage = false;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = res.sort((a, b) => b.id - a.id);
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
      this.dataSource.paginator = this.myPaginator;
    })
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  formCancelConfirm() {
    this.ngOnInit();
  }

  formResetConfirm() {
    this.nameId.nativeElement.value = this.reviewName;
    this.codeId.nativeElement.value = this.reviewCode;
    this.descriptionId.nativeElement.value = this.reviewDescription;
    this.thumbnailId.nativeElement.value = this.reviewThumbnail;
    this.URLId.nativeElement.value = this.reviewURL;
    this.validation = false;
  }

  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }

  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }
}
