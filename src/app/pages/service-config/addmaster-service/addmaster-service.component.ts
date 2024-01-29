import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { MasterServiceService } from '../../../services/master service/master-service.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from '../../../model/service';
import { Observable } from 'rxjs';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-addmaster-service',
  templateUrl: './addmaster-service.component.html',
  styleUrls: ['./addmaster-service.component.css']
})
export class AddmasterServiceComponent implements OnInit {

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.serviceForm.dirty) {
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

  NoRecordsFound = false;
  serviceListView = true;
  serviceFormView = true;
  serviceForm: FormGroup;
 service: Service = new Service();
  serviceReadModeView = false;
  serviceMessage: string;
  dynamicRedirection: string;
  public addEditText = 'Add';
  services = {};
  data: any;
  dataId: any;
  warningFlag: string;
  showLoaderImage=false;
  constructor(private globalService: globalSharedService, private serviceservice: MasterServiceService, private formBuilder: FormBuilder, private router: Router,
    private dialogService: DialogService, private route:ActivatedRoute) {
  }
  ngOnInit() {
    this.data = this.globalService.listOfModulesforServices;
    this.dataId = this.globalService.listOfModulesforServices.id;
    this.masterServiceForm();
    let serviceId = this.globalService.selectedId;
    if (serviceId == null || serviceId == undefined) {
      this.addEditText = 'Add';
      this.services = this.globalService.listOfModulesforServices;
      this.getService(this.services);
    } else {
      this.editService(this.globalService.listOfRow);
      this.addEditText = "Edit";
    }
  }

  masterServiceForm() {
    this.serviceForm = this.formBuilder.group({
      id: [null],
      moduleName: ['', [Validators.required, Validators.pattern(this.globalService.getNamePattern())]],
      name: ['',/* [Validators.required,this.noWhitespace, Validators.pattern('^[a-zA-Z/ ]*$')] */],
      dataOperation: ['', Validators.required],
      description: ['', Validators.required],
      displayName: ['', [Validators.required,
      Validators.pattern(this.globalService.getNamePattern())]],
      webServiceModuleId: [null],
      status: ["Active"]
    });
  }
  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }


  dataOperations: Array<Object> = [
    { dataOperation: 'DELETE', },
    { dataOperation: 'GET' },
    { dataOperation: 'POST', },
    { dataOperation: 'PUT', },
  ];


  getServiceByServiceId(id: number) {
    this.serviceservice.getServiceByServiceId(id)
      .subscribe(data => {
        this.serviceForm.patchValue({
          moduleName: data.websServiceModuleName,
          webServiceModuleId: data.webServiceModuleId,
          id: data.id,
          displayName: data.displayName,
          name: data.name,
          status: data.status,
          description: data.description,
          dataOperation: data.dataOperation
        });
      });
  }
  getService(services) {
    this.serviceForm.patchValue({
      moduleName: services['name'],
    });
  }
  editService(data) {
    this.serviceForm.patchValue({
      moduleName: data.websServiceModuleName,
      webServiceModuleId: data.webServiceModuleId,
      id: data.id,
      displayName: data.displayName,
      name: data.name,
      status: data.status,
      description: data.description,
      dataOperation: data.dataOperation
    });
  }

  cancelServiceForm(event: Event) {
    this.serviceListView = true;
    this.serviceFormView = false;
    this.serviceForm.reset();
  }

  resetServiceForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.service = <Service>this.serviceForm.value;
    if (this.service.id === null) {
      this.masterServiceForm();
      this.getService(this.services);
    }
    else {
      this.masterServiceForm();
      this.editService(this.globalService.listOfRow);
    }
  }

  //Review and Save method
  createService(): void {
    this.serviceListView = false;
    this.serviceReadModeView = true;
    this.serviceFormView = false;
    this.service = <Service>this.serviceForm.value;
  }
  //  save Service Information
  saveService() {
    this.showLoaderImage=true;
    this.service.createdBy = sessionStorage.getItem('userId');
    this.service.webServiceModuleId = this.dataId;
    if (this.service.id === null) {
      this.serviceservice.addService(this.service).subscribe(res => {
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.masterServiceForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          // this.serviceMessage = "Service not created ";
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.service.updatedBy = sessionStorage.getItem('userId');
      this.serviceservice.updateService(this.service).subscribe((res) => {
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.masterServiceForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }


  // Redirect to
  redirectTo() {
    this.router.navigate(['../'], {relativeTo:this.route});
    this.globalService.GettingString('mngService');
    this.globalService.GettingId(this.dataId);
    this.globalService.setOrganizationDetail('', this.data);
  }


  // back Button
  backButton(elementId) {
    this.serviceFormView = true;
    this.serviceReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  goToModule() {

  }
  cancleAddMasterServiceForm() {
    this.globalService.GettingString('mngService');
    this.globalService.GettingId(this.dataId);
    this.globalService.setOrganizationDetail('', this.data);
    this.router.navigate(['../'], {relativeTo:this.route});
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.serviceForm.get('displayName').setErrors({
        pattern: true
      });
    }
  }
}
