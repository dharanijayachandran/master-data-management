import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIModalNotificationPage, globalSharedService } from 'global';
import { globalService } from 'src/app/shared/globalService';
import { Router } from '@angular/router';
import { Applications } from '../../model/application';
import { ServiceConsumerServicesService } from '../../services/service-consumer-services.service';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {

  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  public applications: Applications = new Applications();
  ApplicationForm: FormGroup;
  applicationFormView: boolean = true;
  warningFlag: string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  form: boolean;
  view: boolean;
  savePage: boolean;
  editPage: boolean;
  viewIcon: boolean;
  showLoaderImage: boolean;
  consumerList: any;
  userId: string;
  getConsumerName: any;
  getConsumerElement: any;
  applicationCategory: any;
  getApplicationName: any;
  getServiceConsumerId: any;

  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService, private router: Router, private globalServices: globalService, private ServiceConsumerService: ServiceConsumerServicesService) { }

  ngOnInit(): void {
    this.savePage = this.globalServices.savePage;
    this.editPage = this.globalServices.editPage;
    this.viewIcon = this.globalServices.viewIcon;
    this.getConsumerElement = this.globalServices.ServiceConsumerElement.name;
    this.getServiceConsumerId = this.globalServices.ServiceConsumerElement.id;
    this.applicationFormValidation();
    this.getServiceConsumer();
    this.getApplicationCategoryDropdown();
    if (this.savePage) {
      this.form = true;
      this.view = false;
    }
    else if (this.editPage) {
      this.form = true;
      this.view = false;
      this.editApplication(this.globalServices.updateElement);
    }
    if (this.viewIcon) {
      this.applications = this.globalServices.updateElement;
      this.form = false;
      this.view = true;
    }
  }

  getApplicationCategoryDropdown() {
    this.ServiceConsumerService.getApplicationCategoryDropdown().subscribe(
      res => {
        this.getApplicationName = res;
        this.applicationCategory = this.getApplicationsToConsumerDropDown(res);
      },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  public fields: Object = {
    text: 'name',
    value: 'id'
  };

  getServiceConsumer() {
    this.ServiceConsumerService.getServiceConsumer().subscribe(
      res => {
        this.getConsumerName = res;
        this.consumerList = this.getApplicationsToConsumerDropDown(res);
      },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  applicationFormValidation() {
    this.ApplicationForm = this.formBuilder.group({
      serviceConsumerId: [this.getConsumerElement],
      name: ['', [Validators.required, Validators.pattern(/^[\S]+.*[\S]$/), Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/), Validators.maxLength(50), Validators.minLength(4)]],
      description: ['', [Validators.maxLength(500)]],
      appCategoryId: ['', [Validators.required]],
      status: ['A']
    });
  }

  // Update web service consumer detail
  editApplication(data) {
    this.ApplicationForm.patchValue({
      serviceConsumerId: this.getConsumerElement,
      name: data.name,
      code: data.code,
      description: data.description,
      appCategoryId: data.appCategoryId
    });
  }

  createApplication() {
    this.form = false;
    this.view = true;
    this.applications = <Applications>this.ApplicationForm.value;
  }

  save() {
    this.showLoaderImage = true;
    this.userId = sessionStorage.getItem("userId");
    this.ApplicationForm.removeControl('serviceConsumerId');
    if (this.savePage) {
      this.ApplicationForm.value.createdBy = this.userId;
      this.ApplicationForm.value.status = "A";
      this.ApplicationForm.value.code = this.ApplicationForm.value.code.toUpperCase();
      this.ServiceConsumerService.saveApplication(this.ApplicationForm.value, this.getServiceConsumerId).subscribe(
        res => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
    if (this.editPage) {
      this.ApplicationForm.value.updatedBy = this.userId;
      this.ApplicationForm.value.code = this.ApplicationForm.value.code.toUpperCase();
      this.ServiceConsumerService.editApplication(this.ApplicationForm.value, this.getServiceConsumerId, this.globalServices.updateElement.id).subscribe(
        res => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        },
        error => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
  }

  back() {
    if (this.viewIcon) {
      this.router.navigate(['consumer-service/applications-list']);
    }
    else {
      this.form = true;
      this.view = false;
    }
  }

  cancel() {
    if (!this.ApplicationForm.dirty && this.ApplicationForm.pristine || !this.ApplicationForm.dirty && !this.ApplicationForm.pristine) {
      this.formCancelConfirm();
    }
    else {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  reset() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
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
    this.router.navigate(['consumer-service/applications-list']);
  }

  formResetConfirm() {
    if (this.savePage) {
      this.ApplicationForm.reset();
      this.ApplicationForm.value.ServiceConsumerId = this.getConsumerElement;
      this.editApplication(this.ApplicationForm.value);
    }
    else if (this.editPage) {
      this.editApplication(this.globalServices.updateElement);
    }
  }

  getApplicationsToConsumerDropDown(res) {
    return this.getDataList(res);
  }

  getDataList(data) {
    if (data != null) {
      return data.map(function (l) {
        return {
          name: l.name,
          id: l.id,
        };
      });
    }
  }

  getApplicationNameById(id: number): string {
    let name: string;
    this.getApplicationName.forEach(element => {
      if (element.id == id) {
        name = element.name;
      }
    });
    return name;
  }

}
