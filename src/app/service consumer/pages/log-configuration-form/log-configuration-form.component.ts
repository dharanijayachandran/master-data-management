import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UIModalNotificationPage, globalSharedService } from 'global';
import { globalService } from 'src/app/shared/globalService';
import { LogConfiguration } from '../../model/logConfiguration';
import { ServiceConsumerServicesService } from '../../services/service-consumer-services.service';

@Component({
  selector: 'app-log-configuration-form',
  templateUrl: './log-configuration-form.component.html',
  styleUrls: ['./log-configuration-form.component.css']
})
export class LogConfigurationFormComponent implements OnInit {

  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  public logConfiguration: LogConfiguration = new LogConfiguration();
  LogConfigurationForm: FormGroup;
  logConfigurationFormView: boolean = true;
  warningFlag: string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  form: boolean;
  view: boolean;
  savePage: boolean;
  editPage: boolean;
  viewIcon: boolean;
  ServiceConsumerElementId: any;
  ServiceConsumerElementName: any;
  serviceConsumerApplicationElementName: any;
  serviceConsumerApplicationElementId: any;
  logLevelDropdown: any;
  showLoaderImage: boolean;
  userId: any;
  getLogLevelNameById: any;
  logOutputDestinationDropdown: any;
  getLogOutputDestinationNameById: any;

  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService, private router: Router, private globalServices: globalService, private ServiceConsumerService: ServiceConsumerServicesService) { }

  ngOnInit(): void {
    this.savePage = this.globalServices.savePage;
    this.editPage = this.globalServices.editPage;
    this.viewIcon = this.globalServices.viewIcon;
    this.ServiceConsumerElementId = this.globalServices.ServiceConsumerElement.id;
    this.ServiceConsumerElementName = this.globalServices.ServiceConsumerElement.name;
    this.serviceConsumerApplicationElementName = this.globalServices.serviceConsumerApplicationElement.name;
    this.serviceConsumerApplicationElementId = this.globalServices.serviceConsumerApplicationElement.id;
    this.getLogLevel();
    this.getLogOutputDestination();
    this.logConfigurationFormValidation();
    if (this.savePage) {
      this.form = true;
      this.view = false;
    }
    else if (this.editPage) {
      this.form = true;
      this.view = false;
      this.editLogConfiguration(this.globalServices.updateElement);
    }
    if (this.viewIcon) {
      this.logConfiguration = this.globalServices.updateElement;
      this.form = false;
      this.view = true;
    }
  }

  public fields: Object = {
    text: 'name',
    value: 'id'
  };

  getLogLevel() {
    this.ServiceConsumerService.getLogLevel().subscribe(res => {
      this.getLogLevelNameById = res;
      this.logLevelDropdown = this.getDropDown(res);
    },
    error => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    });
  }

  getLogOutputDestination() {
    this.ServiceConsumerService.getLogOutputDestination().subscribe(res => {
      this.getLogOutputDestinationNameById = res;
      this.logOutputDestinationDropdown = this.getDropDown(res);
    },
    error => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    });
  }

  getDropDown(res) {
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

  logConfigurationFormValidation() {
    this.LogConfigurationForm = this.formBuilder.group({
      serviceConsumerId: [this.ServiceConsumerElementId],
      serviceConsumerAppId: [this.serviceConsumerApplicationElementId],
      logLevelId: ['', [Validators.required]],
      logOutputDestinationId: ['', [Validators.required]],
      logRetentionPeriod: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]]
    });
  }

  editLogConfiguration(data) {
    this.LogConfigurationForm.patchValue({
      logLevelId: data.logLevelId,
      logOutputDestinationId: data.logOutputDestinationId,
      logRetentionPeriod: data.logRetentionPeriod
    });
  }

  createLogConfiguration() {
    this.form = false;
    this.view = true;
    this.logConfiguration = <LogConfiguration>this.LogConfigurationForm.value;
  }

  save() {
    this.showLoaderImage = true;
    this.userId = sessionStorage.getItem("userId");
    this.LogConfigurationForm.removeControl('serviceConsumerId');
    this.LogConfigurationForm.removeControl('serviceConsumerAppId');
    if (this.savePage) {
      this.LogConfigurationForm.value.createdBy = this.userId;
      this.LogConfigurationForm.value.status = "A";
      this.ServiceConsumerService.saveLog(this.LogConfigurationForm.value, this.globalServices.ServiceConsumerElement.id, this.serviceConsumerApplicationElementId).subscribe(
        res => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
    if (this.editPage) {
      this.LogConfigurationForm.value.updatedBy = this.userId;
      this.LogConfigurationForm.value.status = "A";
      this.ServiceConsumerService.editLog(this.LogConfigurationForm.value, this.globalServices.ServiceConsumerElement.id, this.serviceConsumerApplicationElementId, this.globalServices.updateElement.id).subscribe(
        res => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
  }

  back() {
    if (this.viewIcon) {
      this.router.navigate(['consumer-service/log-configuration']);
    }
    else {
      this.form = true;
      this.view = false;
    }
  }

  cancel() {
    if (!this.LogConfigurationForm.dirty && this.LogConfigurationForm.pristine || !this.LogConfigurationForm.dirty && !this.LogConfigurationForm.pristine) {
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
    this.router.navigate(['consumer-service/log-configuration']);
  }

  formResetConfirm() {
    if (this.savePage) {
      this.LogConfigurationForm.reset();
    }
    else if (this.editPage) {
      this.editLogConfiguration(this.globalServices.updateElement);
    }
  }

  getLogLevelName(id) {
    let name: string;
    this.getLogLevelNameById.forEach(element => {
      if (element.id == id) {
        name = element.name;
      }
    });
    return name;
  }

  getLogOutputDestinationName(id) {
    let name: string;
    this.getLogOutputDestinationNameById.forEach(element => {
      if (element.id == id) {
        name = element.name;
      }
    });
    return name;
  }

}
