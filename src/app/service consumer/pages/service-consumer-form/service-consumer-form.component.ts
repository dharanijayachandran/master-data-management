import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UIModalNotificationPage, globalSharedService } from 'global';
import { globalService } from 'src/app/shared/globalService';
import { ServiceConsumer } from '../../model/serviceConsumer';
import { ServiceConsumerServicesService } from '../../services/service-consumer-services.service';

@Component({
  selector: 'app-service-consumer-form',
  templateUrl: './service-consumer-form.component.html',
  styleUrls: ['./service-consumer-form.component.css']
})
export class ServiceConsumerFormComponent implements OnInit {

  public serviceConsumer: ServiceConsumer = new ServiceConsumer();
  ServiceConsumerForm: FormGroup;
  warningFlag: string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  form: boolean;
  view: boolean;
  savePage: boolean;
  editPage: boolean;
  viewIcon: boolean;
  showLoaderImage: boolean;
  userId: any;

  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService, private router: Router, private globalServices: globalService, private ServiceConsumerService: ServiceConsumerServicesService) { }

  ngOnInit(): void {
    this.savePage = this.globalServices.savePage;
    this.editPage = this.globalServices.editPage;
    this.viewIcon = this.globalServices.viewIcon;
    this.ServiceConsumerFormValidation();
    if (this.savePage) {
      this.form = true;
      this.view = false;
    }
    else if (this.editPage) {
      this.form = true;
      this.view = false;
      this.editConsumerService(this.globalServices.updateElement);
    }
    if (this.viewIcon) {
      this.serviceConsumer = this.globalServices.updateElement;
      this.form = false;
      this.view = true;
    }
  }

  ServiceConsumerFormValidation() {
    this.ServiceConsumerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[\S]+.*[\S]$/), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      key: ['key'],
      password: ['password'],
      code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/), Validators.minLength(4), Validators.maxLength(20)]],
      status: ['A'],
    })
  }

  // Update web service consumer detail
  editConsumerService(data) {
    this.ServiceConsumerForm.patchValue({
      name: data.name,
      description: data.description,
      code: data.code
    });
  }

  createServiceConsumer() {
    this.form = false;
    this.view = true;
    this.serviceConsumer = <ServiceConsumer>this.ServiceConsumerForm.value;
  }

  save() {
    this.showLoaderImage = true;
    this.userId = sessionStorage.getItem("userId");
    if (this.savePage) {
      this.ServiceConsumerForm.value.createdBy = this.userId;
      this.ServiceConsumerForm.value.code = this.ServiceConsumerForm.value.code.toUpperCase();
      this.ServiceConsumerService.saveServiceConsumer(this.ServiceConsumerForm.value).subscribe(
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
      this.ServiceConsumerForm.value.updatedBy = this.userId;
      this.ServiceConsumerForm.value.id = this.globalServices.updateElement.id;
      this.ServiceConsumerForm.value.code = this.ServiceConsumerForm.value.code.toUpperCase();
      this.ServiceConsumerService.editServiceConsumer(this.ServiceConsumerForm.value).subscribe(
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
      this.router.navigate(['/', 'consumer-service']);
    }
    else {
      this.form = true;
      this.view = false;
    }
  }

  cancel() {
    if (!this.ServiceConsumerForm.dirty && this.ServiceConsumerForm.pristine || !this.ServiceConsumerForm.dirty && !this.ServiceConsumerForm.pristine) {
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
    this.router.navigate(['/', 'consumer-service']);
  }

  formResetConfirm() {
    if (this.savePage) {
      this.ServiceConsumerForm.reset();
    }
    else if (this.editPage) {
      this.editConsumerService(this.globalServices.updateElement);
    }
  }

}
