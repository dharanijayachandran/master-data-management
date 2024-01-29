import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationGroupService } from '../../../services/notification group/notification-group/notification-group.service';
import { NotificationGroupUser } from '../../../model/NotificationGroupUser';
import { NotificationMedia } from '../../../model/NotificationMedia';
import { NotificationGroup } from '../../../model/NotificationGroup';
import { User } from 'src/app/notification group/model/user';
import { OwnerUserService } from 'src/app/access group/services/ownerUser/owner-user.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { TimeZone, UIModalNotificationPage } from 'global';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-notification-group-form',
  templateUrl: './notification-group-form.component.html',
  styleUrls: ['./notification-group-form.component.css']
})
export class NotificationGroupFormComponent implements OnInit {
  confirmedNotificationUsersGroupList: NotificationGroupUser[] = [];
  notificationGroupUsersList: User[] = [];
  notificationMediaList: NotificationMedia[] = [];
  notificationGroupForm: FormGroup;
  warningFlag: string;
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  notificationGroup: NotificationGroup = new NotificationGroup();
  notificationGroupId: number;
  addEditText: string;
  notificationDetails: any;
  notificationDetailsList: any;
  selectedNotificationMediaValues = [];
  errorMessage = false;
  enableSave = false;
  enableReset: boolean=false;
  timeZoneList: TimeZone[] = [];
  public data: { [key: string]: Object; }[] = []
// maps the appropriate column to fields property
public fields: Object = { text: 'Name' };
// set the height of the popup element
public height: string = '220px';
// set the placeholder to DropDownList input element
public watermark: string = 'Select TimeZone';
// set the placeholder to filter search box input element
public filterPlaceholder: string = 'Search';
public sort:string ='Ascending';
timezoneMap=new Map();
timezoneMapWithName=new Map();

  constructor(private formBuilder: FormBuilder, private userService: OwnerUserService, private notificationGroupService: NotificationGroupService, private globalService: globalSharedService, private router: Router, private route: ActivatedRoute,    private globalSharedService: globalSharedService,
    ) { }
    public locale: string;

  ngOnInit(): void {
    this.enableSave = false;
    this.getTimeZoneList()
    this.locale = this.globalSharedService.getLanguage();
    this.loadNotificationGroupForm();
    this.getNotificationMedia();
    this.getNotificationGroupUsers();
    // Checking whether clicked new notification group and edit notification group
    this.notificationGroupId = this.globalService.id;
    if (this.notificationGroupId == null || this.notificationGroupId == undefined) {
      this.addEditText = "Add";
      if (this.globalService.listOfRow.hasOwnProperty('name')) {
        this.globalService.listOfRow.id = null;
        this.editNotificationGroup(this.globalService.listOfRow);
      } else {
      }
    } else if (this.notificationGroupId != null) {
      this.addEditText = "Edit";
      this.notificationDetailsList = this.globalService.listOfRow;
      this.getAllTimeZoneList()

    }
  }
  loadNotificationGroupForm() {
    this.notificationGroupForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())],
      ],
      description: [''],
      notificationMediaList: this.formBuilder.array([]),
      status: ['Active'],
      timeZone: null,

    })
  }
  /*  public addNotificationMediaFormGroup(element): FormGroup {
     return this.formBuilder.group({
       notificationMediaId: element.notificationMediaId,
       name: element.name,
       id: element.id,
       notificationGroupId: element.notificationGroupId,
       status: element.status,
       isChecked: [false]

     })
   } */
  // This method is used to get Notification media
  getNotificationMedia() {
    this.notificationMediaList = this.globalService.notificationMediaList;
    this.notificationGroupForm.setControl('notificationMediaList', this.patchFormArray(this.notificationMediaList));
    /*  const formArray = <FormArray>this.notificationGroupForm.controls['notificationMediaList'];
     this.notificationMediaList.forEach(e => {
       formArray.push(this.addNotificationMediaFormGroup(e));
     }) */
  }

  // This method is used to get Notification group users
  getNotificationGroupUsers() {
    this.notificationGroupUsersList = this.globalService.usersList;
    this.notificationGroupUsersList.forEach(e => {
      e.userNameAndEmail = e.firstName.concat(" (", e.emailId, ")");
    })
    this.globalService.setUsersList(this.notificationGroupUsersList);
    this.doReset();
  }


  // This method is used to get Notification group users
  getNotificationGroupUsersConfirmed(res) {
    let returnObj = [];
    this.confirmedNotificationUsersGroupList = res;
    this.globalService.setConfirmedAccessGroupList(this.confirmedNotificationUsersGroupList);
    this.confirmedNotificationUsersGroupList.map(function (o) {
      let Obj = {
        "id": o["recipientUserId"],
        "userNameAndEmail": o["recipientUserName"],
        "status": o["status"],
      }
      returnObj.push(Obj);
    });
    this.confirmedNotificationUsersGroupList = returnObj;
    //
    this.doReset();
  }
  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  confirmed: Array<any>;
  notificationGroupUserAdd = '';
  disabled = false;

  sourceLeft = true;
  format = {
    all: "Select All",
    none: "Deselect All"
  }

  private sourceNotificationUsersGroup: Array<any>;

  private confirmedNotificationUsersGroup: Array<any>;

  private confirmedNotificationUsersObject() {
    this.key = "id";
    this.display = "userNameAndEmail";
    this.keepSorted = true;
    this.source = this.sourceNotificationUsersGroup;
    this.confirmed = this.confirmedNotificationUsersGroup;
  }


  doReset() {
    this.sourceNotificationUsersGroup = JSON.parse(JSON.stringify(this.notificationGroupUsersList));
    this.confirmedNotificationUsersGroup = JSON.parse(JSON.stringify(this.confirmedNotificationUsersGroupList));
    this.confirmedNotificationUsersObject();
  }

  doDelete() {
    if (this.source.length > 0) {
      this.source.splice(0, 1);
    }
  }

  doCreate() {
    if (typeof this.source[0] === 'object') {
      const o = {};
      o[this.key] = this.source.length + 1;
      o[this.display] = this.notificationGroupUserAdd;
      this.source.push(o);
    } else {
      this.source.push(this.notificationGroupUserAdd);
    }
    this.notificationGroupUserAdd = '';
  }

  doAdd() {
    for (let i = 0, len = this.source.length; i < len; i += 1) {
      const o = this.source[i];
      const found = this.confirmed.find((e: any) => e === o);
      if (!found) {
        this.confirmed.push(o);
        break;
      }
    }
  }

  doRemove() {
    if (this.confirmed.length > 0) {
      this.confirmed.splice(0, 1);
    }
  }

  doFilter() {
    this.filter = !this.filter;
  }

  filterBtn() {
    return (this.filter ? 'Hide Filter' : 'Show Filter');
  }

  doDisable() {
    this.disabled = !this.disabled;
  }

  disableBtn() {
    return (this.disabled ? 'Enable' : 'Disabled');
  }

  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
  }

  // Cancel -----------> navigate to Notification Group list
  cancelnotificationGroupForm(event) {
    this.globalService.setId(null);
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }


  // Confirm redirect to
  @Output() navigateTemplate = new EventEmitter();
  formCancelConfirm() {
    this.enableReset=false;
    this.enableSave = false;
    this.errorMessage = false;
    this.notificationGroupForm.reset();
    this.navigateTemplate.emit('notification-group');
  }

  resetnotificationGroupForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');

  }
  // Notification Group reset  confirm
  formResetConfirm() {
    this.enableSave = false;
    this.errorMessage = false;
    this.notificationDetails = this.notificationGroupForm.value;
    if (this.notificationDetails.id === null) {
      this.loadNotificationGroupForm();
      this.confirmed = [];
      this.userMovedByNotificationGroup = false;
      this.enableReset=false;
      this.notificationGroupForm.setControl('notificationMediaList', this.patchFormArray(this.notificationMediaList));
    }
    else {
      this.loadNotificationGroupForm();
      this.editNotificationGroup(this.notificationDetailsList);
    }
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }
  getnotificationGroupUserIds() {
    let notificationGroupUser = [];
    if (this.globalService.notificationGroupDetails == null || this.globalService.notificationGroupDetails == undefined) {
      this.confirmed.map(function (ob) {
        if (ob.id != "null" || ob.id != undefined) {
          ob['id'] = ob.id;
          let Obj = {
            "recipientUserId": ob['id'],
          }
          notificationGroupUser.push(Obj);
        }
      })
    }
    else {
      let notificationGroupUserobj = this.globalService.notificationGroupDetails.notificationGroupUser;
      let soretdConfirmedList = this.confirmed.sort(function (a, b) { return a.id - b.id });
      let sortedNotificationGroupUserList = notificationGroupUserobj.sort(function (a, b) { return a.recipientUserId - b.recipientUserId });
      this.confirmed.map(function (ob) {
        let Obj;
        let match = [];
        sortedNotificationGroupUserList.filter(element => {
          if (element.recipientUserId == ob.id) {
            match.push(element);
          }
        })
        if (match.length != 0) {
          match.forEach(element => {
            if (element != null) {
              if (element.recipientUserId == ob.id) {
                if (ob.id != "null" || ob.id != undefined) {
                  Obj = {
                    "recipientUserId": ob.id,
                    "status": "Active",
                    "id": element.id
                  }
                }
              }
            }
          })
        }
        else {
          Obj = {
            "recipientUserId": ob.id,
            "status": "Active",
            "id": null
          }
        }
        notificationGroupUser.push(Obj);
      });
    }
    return notificationGroupUser;
  }
  getnotificationGroupMediaIds(notificationMediaList) {
    let notificationGroupMedia = [];
    if (this.globalService.notificationGroupDetails == null || this.globalService.notificationGroupDetails == undefined) {
      notificationMediaList.map(function (ob) {
        if (ob.isChecked == true) {
          if (ob.id != "null" || ob.id != undefined) {
            ob['id'] = ob.id;
            let Obj = {
              "notificationMediaId": ob['id'],
            }
            notificationGroupMedia.push(Obj);
          }
        }
      })
    } else {
      let notificationGroupMediaobj = this.globalService.notificationGroupDetails.notificationGroupMedia;
      let soretdNotificationMediaList = notificationMediaList.sort(function (a, b) { return a.id - b.id });
      let sortedNotificationGroupMediaList = notificationGroupMediaobj.sort(function (a, b) { return a.notificationMediaId - b.notificationMediaId });
      soretdNotificationMediaList.map(function (ob) {
        let match = [];
        let Obj
        sortedNotificationGroupMediaList.filter(element => {
          if (element.notificationMediaId == ob.id) {
            match.push(element);
          }
        })
        if (ob.isChecked != true) {
          if (match.length != 0) {
            match.forEach(element => {
              if (element != null) {
                if (element.notificationMediaId == ob.id) {
                  Obj = {
                    "notificationMediaId": ob.id,
                    "status": "Deleted",
                    "id": element.id
                  }
                }
              }
            })
          }
        }
        else {
          if (match.length != 0) {
            match.forEach(element => {
              if (element != null) {
                if (element.notificationMediaId == ob.id) {
                  Obj = {
                    "notificationMediaId": ob.id,
                    "status": "Active",
                    "id": element.id
                  }
                }
              }
            })
          }
          else {
            Obj = {
              "notificationMediaId": ob.id,
              "status": "Active",
              "id": null
            }
          }
        }
        if (Obj != undefined) {
          notificationGroupMedia.push(Obj);
        }
      });
    }
    //
    return notificationGroupMedia;
  }
  isSelected(obj, event) {
    if (event.checked) {
      this.selectedNotificationMediaValues.push(obj);
    }
    else {
      let index = this.selectedNotificationMediaValues.indexOf(obj);
      this.selectedNotificationMediaValues.splice(index, 1);
    }
    this.errorMessage = this.selectedNotificationMediaValues.length > 0 ? false : true;
    if (this.errorMessage) {
      this.enableSave = false;
    }
    else {
      this.enableSave = true;
    }
  }
  previewNotificationGroup() {

    this.notificationGroup = this.notificationGroupForm.value;
    let timezone=this.notificationGroup.timeZone
    if(this.timezoneMap.has(timezone)){
      let timezoneId=this.timezoneMap.get(timezone)
      this.notificationGroup.timeZoneId=timezoneId;
    }
    else{
      this.notificationGroup.timeZoneId=null

    }

    let notificationGroupMedia = this.getnotificationGroupMediaIds(this.notificationGroup.notificationMediaList);
    this.notificationGroup.notificationGroupMedia = notificationGroupMedia;
    this.notificationGroup.notificationGroupUser = this.getnotificationGroupUserIds();
    this.globalService.setOrganizationDetail("", this.notificationGroup);
    let confirmedList = this.globalService.confirmedNotificationGroupList;
    this.navigateTemplate.emit('notification-group-Preview');
  }
  redirectTo() {
    this.navigateTemplate.emit('notification-group');
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.notificationGroupForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  editNotificationGroup(notificationDetails) {
    this.userMovedByNotificationGroup = true;
    this.enableReset=false;
    this.enableSave = true;
    let timeZoneId=notificationDetails['timeZoneId']
    let timeZoneVal;
    if (this.timezoneMapWithName.has(timeZoneId)) {
      timeZoneVal = this.timezoneMapWithName.get(timeZoneId)
    }
    this.notificationGroupForm.patchValue({
      id: notificationDetails.id,
      name: notificationDetails.name,
      description: notificationDetails.description,
      status: notificationDetails.status,
      timeZone:timeZoneVal
    });
    this.notificationGroupForm.setControl('notificationMediaList', this.patchFormArray(notificationDetails.notificationGroupMedia));
    this.getNotificationGroupUsersConfirmed(notificationDetails.notificationGroupUser)
  }

  patchFormArray(notificationMediaGroupList): FormArray {
    const formArray = new FormArray([]);
    if (this.notificationMediaList != null && this.notificationMediaList.length != 0) {
      var tempArray = this.notificationMediaList;
      tempArray.forEach(element => {
        let isSelected = false;
        let index = 0;
        for (let notificationMediaGroup of notificationMediaGroupList) {
          if (element.id === notificationMediaGroup.notificationMediaId) {
            isSelected = true;
            this.selectedNotificationMediaValues.push(element);
            break;
          }
          index++;
        }
        if (isSelected) {
          formArray.push(this.formBuilder.group({
            id: notificationMediaGroupList[index].notificationMediaId,
            isChecked: true,
            name: notificationMediaGroupList[index].notificationMediaName,
            status: notificationMediaGroupList[index].status
          }))
        }
        else {
          formArray.push(this.formBuilder.group({
            isChecked: false,
            name: element.name,
            id: element.id,
            status: element.status
          }))
        }
      })
    }
    return formArray;
  }

  get notificationMediaArray() {
    return <FormArray>this.notificationGroupForm.get('notificationMediaList');
  }

  userMovedByNotificationGroup: boolean = false;
  getUserMovedByNotificationGroup(event) {

    if (event.length) {
     // this.saveButtonDisableStatus = false;
     this.userMovedByNotificationGroup = true;
     this.enableReset=true;
    }
    else {
     // this.saveButtonDisableStatus = true;
     this.userMovedByNotificationGroup = false;
     this.enableReset=false;
    }
  }

  getTimeZoneList() {
    this.notificationGroupService.getTimeZoneList().subscribe(
      res => {
        this.timeZoneList = res;
        if (this.timeZoneList) {
          this.timeZoneFilter()
        }
      },
      (error: any) => {
       this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }
  timeZoneFilter() {
    // if (this.timeZoneList) {
    //   let Obj = {
    //     "Name": "--Select--",
    //   }
    //   this.data.push(Obj);;
    // }

    this.timeZoneList.forEach(e => {
      this.timezoneMap.set(e.name, e.id);
      let Obj = {
        "id":e.id,
        "Name": e.name
      }
      this.data.push(Obj);
    })


  }

   // filtering event handler to filter a Country
   public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('Name', 'contains', e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.data, query);
  }

  getAllTimeZoneList() {
    this.notificationGroupService.getTimeZoneList().subscribe(
      res => {
        this.timeZoneList = res;
        this.timeZoneList.forEach(e => {
          this.timezoneMapWithName.set(e.id, e.name);
        })
        this.editNotificationGroup(this.globalService.listOfRow);

      },
      (error: any) => {
       this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );
  }
}
