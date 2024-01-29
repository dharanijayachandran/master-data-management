import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ServiceConsumerApp } from '../../model/serviceCounsumerApp';
import { WebServiceConsumerService } from '../../services/web service consumer/web-service-consumer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-add-web-service-counsumer-app',
  templateUrl: './add-web-service-counsumer-app.component.html',
  styleUrls: ['./add-web-service-counsumer-app.component.css']
})
export class AddWebServiceCounsumerAppComponent implements OnInit {

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.webServiceConsumerForm.dirty) {
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

  webServiceConsumerListView = false;
  webServiceConsumerReadModeView = false;
  webServiceConsumerFormView = true;
  webServiceConsumerForm: FormGroup;
  public addEditText = 'Add';
  public serviceConsumerApp: ServiceConsumerApp = new ServiceConsumerApp();
  serviceMessage: string;
  dynamicRedirection: string;
  editable = false;
  warningFlag: string;
  showLoaderImage = false;
  constructor(private formBuilder: FormBuilder, private webServiceConsumerService: WebServiceConsumerService, private globalService: globalSharedService, private router: Router,
    private dialogService: DialogService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.webServiceConsumerFormValidation();
    let consumerId = this.globalService.selectedId;
    if (consumerId == null || consumerId == undefined) {
      this.getToken();
      this.addEditText = 'Add';
    } else {
      this.editConsumerApplication(this.globalService.listOfRow);
      this.addEditText = "Edit";
    }
  }

  webServiceConsumerFormValidation() {
    this.webServiceConsumerForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.pattern(this.globalService.getNamePattern())]],
      description: [''],
      key: [''],
      status: ['Active']

    });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  // Update web service consumer detail
  editConsumerApplication(data) {
    this.webServiceConsumerForm.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      key: data.key,
      status: data.status
    });
  }


  //Review and Save method
  createWebServiceConsumer(): void {
    this.webServiceConsumerListView = false;
    this.webServiceConsumerReadModeView = true;
    this.webServiceConsumerFormView = false;
    this.serviceConsumerApp = <ServiceConsumerApp>this.webServiceConsumerForm.value;
  }
  //  save webService consumer Information
  saveWebServiceConsumerApp() {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem("userId");
    this.serviceConsumerApp.password = this.serviceConsumerApp.key;
    this.serviceConsumerApp.appCategoryId = 1;
    if (this.serviceConsumerApp.id === null) {
      this.serviceConsumerApp.createdBy = Number(userId);
      this.webServiceConsumerService.addServiceConsumerApp(this.serviceConsumerApp).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        // this.dynamicRedirection = "../consumer-app";
        this.webServiceConsumerFormValidation();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.serviceConsumerApp.updatedBy = Number(userId);
      this.serviceConsumerApp.token = this.globalService.listOfRow.token;
      this.serviceConsumerApp.appCategoryId = this.globalService.listOfRow.appCategoryId;
      this.webServiceConsumerService.updateServiceConsumerApp(this.serviceConsumerApp).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        // this.dynamicRedirection = "../consumer-app";
        this.webServiceConsumerFormValidation();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // back Button
  backButton(elementId) {
    this.webServiceConsumerFormView = true;
    this.webServiceConsumerReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  cancelWebServiceConsumerForm(event: Event) {
    this.webServiceConsumerListView = true;
    this.webServiceConsumerFormView = false;
    this.webServiceConsumerForm.reset();
  }

  // Reset webserviceconsumer form
  resetWebServiceConsumerForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Form reset  confirm
  formResetConfirm() {
    this.serviceConsumerApp = <ServiceConsumerApp>this.webServiceConsumerForm.value;
    if (this.serviceConsumerApp.id === null) {
      this.webServiceConsumerFormValidation();
      this.getToken();
    }
    else {
      this.webServiceConsumerFormValidation();
      // this.getWebServiceConsumerAppById(this.serviceConsumerApp.id);
      this.editConsumerApplication(this.globalService.listOfRow);
    }
  }


  getToken() {
    this.webServiceConsumerService.getToken()
      .subscribe(
        res => {
          this.webServiceConsumerForm.patchValue({
            key: res.token
          });
        },
        error => {
          //
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }
  // goToConsumerApp
  goToConsumerApp() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.webServiceConsumerForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  // Cancel button
  cancelButton() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}

