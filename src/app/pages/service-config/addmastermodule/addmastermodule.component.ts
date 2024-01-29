import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ModuleService } from '../../../services/module/module.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Module } from '../../../model/module';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-addmastermodule',
  templateUrl: './addmastermodule.component.html',
  styleUrls: ['./addmastermodule.component.css']
})
export class AddmastermoduleComponent implements OnInit {

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.moduleForm.dirty) {
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

  moduleForm: FormGroup;
  public module: Module = new Module();
  moduleListView = false;
  moduleReadModeView = false;
  moduleFormView = true;
  serviceMessage: string;
  dynamicRedirection: string;
  public addEditText = 'Add';
  warningFlag: string;
  showLoaderImage=false;
  constructor(private formBuilder: FormBuilder, private moduleService: ModuleService, private globalService: globalSharedService, private router: Router,
    private dialogService: DialogService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.addMasterModuleForm();
    let moduleId = this.globalService.selectedId;
    if (moduleId == null || moduleId == undefined) {
      this.addEditText = 'Add';
    } else {
      this.editModule(this.globalService.listOfRow);
      this.addEditText = "Edit";
    }
  }

  addMasterModuleForm() {
    this.moduleForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePattern())]],
      description: [''],
      status: ["Active"]
    });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  // Update module details
  getModuleByModuleId(id: number) {
    this.moduleService.getModuleByModuleId(id)
      .subscribe(data => {
        this.moduleForm.patchValue({
          id: data.id,
          name: data.name,
          description: data.description,
          createdBy: data.createdBy,
          status: data.status
        });
      });
  }

  // Update module details
  editModule(data) {
    this.moduleForm.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status
    });
  }

  //Review and Save method
  createModule(): void {
    this.moduleListView = false;
    this.moduleReadModeView = true;
    this.moduleFormView = false;
    this.module = <Module>this.moduleForm.value;
  }
  //  save module  Information
  savemodule() {
    this.showLoaderImage=true;
    let userId = sessionStorage.getItem('userId');
    this.module.createdBy = userId;
    if (this.module.id === null) {
      this.moduleService.addModule(this.module).subscribe(res => {
        this.dynamicRedirection = "../serviceapi";
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.addMasterModuleForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.module.updatedBy = userId;
      this.moduleService.updateModule(this.module).subscribe((res) => {
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.dynamicRedirection = "../serviceapi";
        this.addMasterModuleForm();
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.serviceMessage = "Module not updated";
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // Cancel button
  cancelButton() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // redirectTo
  redirectTo() {
    this.router.navigate(['../'], {relativeTo:this.route});
  }

  // back Button
  backButton(elementId) {
    this.moduleFormView = true;
    this.moduleReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });
  }

  cancelmoduleForm(event: Event) {
    this.moduleListView = true;
    this.moduleFormView = false;
    this.moduleForm.reset();
  }

  // Reset module form
  resetModuleForm() {
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.module = <Module>this.moduleForm.value;
    if (this.module.id === null) {
      this.addMasterModuleForm();
    }
    else {
      this.addMasterModuleForm();
      this.editModule(this.globalService.listOfRow);
    }
  }

  // goToConsumerApp
  goToModule() {
    this.router.navigate([this.dynamicRedirection],{relativeTo:this.route});
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.moduleForm.get('name').setErrors({
        pattern: true
      });
    }
  }
}
