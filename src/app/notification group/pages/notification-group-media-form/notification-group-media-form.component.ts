import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NotificationGroup } from '../../model/NotificationGroup';
import { NotificationMedia } from '../../model/NotificationMedia';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationGroupMediaService } from '../../services/notification group/notification-group-media/notification-group-media.service';
import { NotificationGroupMedia } from '../../model/NotificationGroupMedia';
import { NotificationGroupMediaEntity } from '../../model/NotificationGroupMediaEntity';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-notification-group-media-form',
  templateUrl: './notification-group-media-form.component.html',
  styleUrls: ['./notification-group-media-form.component.css']
})
export class NotificationGroupMediaFormComponent implements OnInit {
  notificationGroupMediaForm: FormGroup;
  @ViewChild(UIModalNotificationPage) modelNotification;
  editable = false;
  notificationGroup: NotificationGroup;
  notificationMediaList: NotificationMedia[] = [];
  dataSource: any;
  showLoaderImage = true;
  displayedColumns: string[] = ['id', 'contactName', 'contactInfo', 'status', 'action'];
  notificationGroupMediaList: NotificationGroupMedia[] = [];
  warningFlag: string;
  notificationGroupMediaDetails: NotificationGroupMedia = new NotificationGroupMedia();
  notificationGroupMediaId = null;
  notificationGroupId = null;
  notificationMediaId = null;
  emailPattern = false;
  mobilePattern = false;
  anonymouseContactobject: NotificationGroupMediaEntity;
  index: number;
  anonymousContactRemovedList: NotificationGroupMediaEntity[] = [];
  ;
  onpageloadNotificationGroupMediaDetails: NotificationGroupMediaEntity[];
  constructor(public formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private notificationGroupMediaService: NotificationGroupMediaService, private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.recipientContact.toLowerCase().includes(filter) ||
        data.recipientContactName.toString().toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.loadNotificationGroupForm();
    this.showLoaderImage = true;
    this.notificationGroup = this.globalService.listOfRow;
    this.notificationGroupId = this.notificationGroup.id;
    if (this.globalService.backId == "backId") {
      this.getNotificationMedia();
      let notificationGroupMediaEntityList: NotificationGroupMediaEntity[] = [];
      this.globalService.setBackId("");
      this.notificationGroupMediaDetails.notificationGroupMediaEntity = this.globalService.notificationGroupmediaDetails.notificationGroupMediaEntity;
      this.notificationMediaId = this.globalService.notificationGroupmediaDetails.notificationMediaId;
      this.notificationGroupMediaId = this.globalService.notificationGroupmediaDetails.id;
      // this.onpageloadNotificationGroupMediaDetails = this.notificationGroupMediaDetails.notificationGroupMediaEntity;
      notificationGroupMediaEntityList = this.notificationGroupMediaDetails.notificationGroupMediaEntity
      notificationGroupMediaEntityList.forEach(element => {
        if (element.status == 'Deleted') {
          this.anonymousContactRemovedList.push(element);
          let idx = notificationGroupMediaEntityList.indexOf(element);
          notificationGroupMediaEntityList.splice(idx, 1);
        }
      });
      this.dataSource.data = notificationGroupMediaEntityList;
      this.showLoaderImage = false;
      this.notificationGroupMediaForm.setControl('notificationGroupMediaEntity', this.patchFormArrayData(notificationGroupMediaEntityList));
    }
    else {
      this.getNotificationMedia();
      this.getNotificationGroupMedia();
    }
  }
  loadNotificationGroupForm() {
    this.notificationGroupMediaForm = this.formBuilder.group({
      notificationGroupMediaEntity: this.formBuilder.array([])
    })
  }
  createRow(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      recipientContact: ['', [Validators.required, Validators.pattern(this.validateContactInfo(this.notificationMediaId))]],
      recipientContactName: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
      status: ['Active']
    });
  }
  addRow(): void {
    let control = <FormArray>this.notificationGroupMediaForm.controls['notificationGroupMediaEntity'];
    let data = this.dataSource.data;
    if (data != null && data.length !== 0) {
      control.push(this.createRow());
      data.push(control);
      this.dataSource.data = data;
    } else {
      data = [];
      control.push(this.createRow())
      data.push(control);
      this.dataSource.data = data;
    }
  }
  getNotificationMedia() {
    this.globalService.notificationMediaList.forEach(e => {
      this.notificationGroup.notificationGroupMedia.forEach(element => {
        if (e.id == element.notificationMediaId)
          this.notificationMediaList.push(e);
      })
    })
  }
  public onChange(): void {  // event will give you full breif of action
    this.loadNotificationGroupForm();
    this.dataSource.data = [];
    this.notificationGroupMediaForm.value.null
    let id = this.globalService.notificationMediaTabDetails;
    if (id != undefined && id != null) {
      this.notificationMediaId = id;
      for (let i = 0; i < this.notificationMediaList.length; i++) {
        if (this.notificationMediaList[i].id == id) {
          // this.validateContactInfo(event.id)
          this.setNotificationGroupMediaDetails(id);
          break;
        }
      }
    }
  }

  patchFormArrayData(notificationGroupMediaEntity): FormArray {
    const formArray = new FormArray([]);
    if (notificationGroupMediaEntity !== null && notificationGroupMediaEntity.length !== 0) {
      notificationGroupMediaEntity.forEach(element => {
        if (element !== null) {
          formArray.push(this.formBuilder.group({
            id: element.id,
            recipientContact: [element.recipientContact, [Validators.required, Validators.pattern(this.validateContactInfo(this.notificationMediaId))]],
            recipientContactName: [element.recipientContactName, [Validators.required,
            Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
            status: element.status
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            recipientContact: ['', [Validators.required, Validators.pattern(this.validateContactInfo(this.notificationMediaId))]],
            recipientContactName: ['', [
              Validators.required,
              Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
            status: ['Active']
          }))
        }
      })
    }
    return formArray
  }
  getNotificationGroupMedia() {
    this.notificationGroupMediaService.getNotificationGroupMedia().subscribe(
      res => {
        this.notificationGroupMediaList = res;
        if (this.notificationGroupMediaList.length != 0) {
          let id = this.globalService.notificationMediaTabDetails;
          if (id == undefined && id == null) {
            this.showLoaderImage = true;
            this.notificationMediaId = this.notificationMediaList[0].id;
            // this.validateContactInfo(this.notificationMediaList[0].id)
            this.setNotificationGroupMediaDetails(this.notificationMediaList[0].id);
          }
          else {
            this.onChange()
          }
        }

      },
      error => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  setNotificationGroupMediaDetails(tabId: number) {
    let notificationGroupMediaEntity: NotificationGroupMediaEntity[] = [];
    for (let i = 0; i < this.notificationGroupMediaList.length; i++) {
      if (this.notificationGroup.id == this.notificationGroupMediaList[i].notificationGroupId
        && tabId == this.notificationGroupMediaList[i].notificationMediaId) {
        this.onpageloadNotificationGroupMediaDetails = this.notificationGroupMediaList[i].notificationGroupMediaEntity;
        this.globalService.setNotificationDetail(this.onpageloadNotificationGroupMediaDetails);
        this.dataSource.data = this.notificationGroupMediaList[i].notificationGroupMediaEntity;
        this.showLoaderImage = false;
        this.notificationGroupMediaId = this.notificationGroupMediaList[i].id;
        notificationGroupMediaEntity = this.notificationGroupMediaList[i].notificationGroupMediaEntity;
        break;
      }
      else {
        this.showLoaderImage = false;
      }
    }
    if (notificationGroupMediaEntity !== null && notificationGroupMediaEntity.length !== 0) {
      this.notificationGroupMediaForm.setControl('notificationGroupMediaEntity', this.patchFormArrayData(notificationGroupMediaEntity));
    }
    else {
      this.validateContactInfo(tabId);
    }
  }
  previewNotificationGroupMedia() {
    this.notificationGroupMediaDetails = this.notificationGroupMediaForm.value
    this.notificationGroupMediaDetails.notificationGroupId = this.notificationGroupId;
    this.notificationGroupMediaDetails.notificationMediaId = this.notificationMediaId;
    this.notificationGroupMediaDetails.id = this.notificationGroupMediaId;
    if (this.anonymousContactRemovedList != undefined && this.anonymousContactRemovedList != null) {
      this.anonymousContactRemovedList.forEach(e => {
        this.notificationGroupMediaDetails.notificationGroupMediaEntity.push(e);
      })
    }
    this.globalService.setNotificationGroupmediaDetails(this.notificationGroupMediaDetails);
    this.globalService.setGlobalId(this.notificationGroupMediaId)

    this.navigateTemplate.emit("notification-group-media-preview");
  }

  // Cancel DiscreteForm the form
  cancelNotificationGroupMediaForm(event) {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }
  @Output() tabName = new EventEmitter();
  // Confirm redirect to
  @Output() navigateTemplate = new EventEmitter();
  @Output() navigateTwoLevelUpDisplayPage = new EventEmitter();
  formCancelConfirm() {
    this.globalService.GettingString('mngGroup');
    this.globalService.setOrganizationDetail("", this.notificationGroup);;
    // this.navigateTemplate.emit('notification-group-media-form');
    this.navigateTwoLevelUpDisplayPage.emit('notification-group');
    let mngGroup = document.getElementById('mngGroup');
    mngGroup.click();
  }
  resetNotificationGroupMediaForm() {
    if (this.notificationGroupMediaForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }
  // Form reset  confirm
  formResetConfirm() {
    //this.loadNotificationGroupForm();
    this.notificationGroupMediaDetails = this.notificationGroupMediaForm.value
    let notificationGroupMediaEntity: NotificationGroupMediaEntity[] = [];
    this.notificationGroupMediaDetails.notificationGroupMediaEntity;
    this.onpageloadNotificationGroupMediaDetails = this.globalService.onpageloadNotificationGroupMediaDetails;
    if (this.notificationGroupMediaDetails.notificationGroupMediaEntity != undefined || this.notificationGroupMediaDetails.notificationGroupMediaEntity != null) {
      this.notificationGroupMediaDetails.notificationGroupMediaEntity.forEach(e => {
        if (this.onpageloadNotificationGroupMediaDetails.length != 0 && this.onpageloadNotificationGroupMediaDetails.length != undefined) {
          for (let i = 0; i < this.onpageloadNotificationGroupMediaDetails.length; i++) {
            if (this.onpageloadNotificationGroupMediaDetails[i].id == e.id) {
              notificationGroupMediaEntity.push(this.onpageloadNotificationGroupMediaDetails[i]);
              break;
            }
            else if (e.id == null) {
              notificationGroupMediaEntity.push(e);
              break;
            }
          }
        }
        else {
          notificationGroupMediaEntity.push(e);
        }
      });
      this.loadNotificationGroupForm();
      this.dataSource.data = notificationGroupMediaEntity;
      this.notificationGroupMediaForm.setControl('notificationGroupMediaEntity', this.resetPatchFormArrayData(notificationGroupMediaEntity));
    }
    else {
      this.loadNotificationGroupForm();
    }
  }
  resetPatchFormArrayData(notificationGroupMediaEntity): FormArray {
    const formArray = new FormArray([]);
    if (notificationGroupMediaEntity !== null && notificationGroupMediaEntity.length !== 0) {
      notificationGroupMediaEntity.forEach(element => {
        if (element.id !== null) {
          formArray.push(this.formBuilder.group({
            id: element.id,
            recipientContact: [element.recipientContact, [Validators.required, Validators.pattern(this.validateContactInfo(this.notificationMediaId))]],
            recipientContactName: [element.recipientContactName, [Validators.required,
            Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
            status: element.status

          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            recipientContact: ['', [Validators.required]],
            recipientContactName: ['', [
              Validators.required,
              Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())]],
            status: ['Active']
          }))
        }
      })
    }
    return formArray
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  get notificationGroupMediaEntity(): FormArray {
    return this.notificationGroupMediaForm.get('notificationGroupMediaEntity') as FormArray;
  }
  validateContactInfo(tabId) {
    let pattern;
    for (let i = 0; i < this.notificationMediaList.length; i++) {
      if (this.notificationMediaList[i].id == tabId) {
        if (this.notificationMediaList[i].name == "Email") {
          this.emailPattern = true;
          pattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
          break;
        }
        else if (this.notificationMediaList[i].name == "SMS") {
          this.mobilePattern = true;
          // pattern = "";
          pattern = "^[0-9]*$"
          break;
        }
      }
    }
    return pattern;
  }

  deleteAnonymousContact(anonymouseContact, index) {
    this.anonymouseContactobject = null;
    this.index = null;
    if (this.anonymouseContactobject == null && this.anonymouseContactobject == undefined) {
      this.anonymouseContactobject = anonymouseContact;
      this.index = index;
    }
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Anonymous Contact!');
  }

  confirmDelete() {
    const control = <FormArray>this.notificationGroupMediaForm.controls['notificationGroupMediaEntity'];
    control.removeAt(this.index)
    if (this.anonymouseContactobject != undefined && this.anonymouseContactobject != null) {
      if (this.anonymouseContactobject.id != null) {
        this.onpageloadNotificationGroupMediaDetails.forEach(notificationGroupmedia => {
          if (this.anonymouseContactobject.id == notificationGroupmedia.id) {
            notificationGroupmedia.status = 'Deleted'
            let obj = this.formatNotificationGroupMediaEntityObj(notificationGroupmedia);
            this.anonymousContactRemovedList.push(obj);
          }
        })
      }
    }
    let temp = this.dataSource.data
    temp.splice(this.index, 1);
    this.dataSource.data = [];
    this.dataSource.data = temp;
  }

  formatNotificationGroupMediaEntityObj(anonymousContactobj) {

    let Obj: NotificationGroupMediaEntity = new NotificationGroupMediaEntity();
    Obj.id = anonymousContactobj.id,
      Obj.recipientContact = anonymousContactobj.recipientContact,
      Obj.recipientContactName = anonymousContactobj.recipientContactName,
      Obj.status = anonymousContactobj.status
    return Obj;
  }
  refreshTableListFunction()
  {}

}
