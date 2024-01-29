import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { AccessGroup } from '../../models/AccessGroup';
import { AccessGroupUser } from '../../models/AccessGroupUser';
import { User } from '../../models/user';

@Component({
  selector: 'app-access-group-form',
  templateUrl: './access-group-form.component.html',
  styleUrls: ['./access-group-form.component.css']
})
export class AccessGroupFormComponent implements OnInit {
  accessGroupForm: FormGroup;
  confirmedAccessUsersGroupList: AccessGroupUser[] = [];
  accessGroupUsersList: User[];
  accessGroupId: number;
  addEditText: string;
  accessGroup: AccessGroup;
  accessGroupDetails: AccessGroup;
  @ViewChild(UIModalNotificationPage) modelNotification;
  usersList: User[];
  warningFlag: string;
  enableReset = false;
  //saveButtonDisableStatus: boolean=false;
  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.loadAccessGroupForm();
    this.usersList = this.globalService.usersList;
    this.getAccessGroupUsers();
    this.accessGroupId = this.globalService.id;
    this.accessGroupDetails = this.globalService.listOfRow;
    if (this.accessGroupId == null || this.accessGroupId == undefined) {
      this.addEditText = "Add";
      if (this.globalService.listOfRow.hasOwnProperty('name')) {
        this.globalService.listOfRow.id = null;
        this.editAccessGroup(this.globalService.listOfRow);
      } else {
      }
    } else if (this.accessGroupId != null) {
      this.addEditText = "Edit";
      //this.accessGroupDetails = this.globalService.listOfRow;
      this.editAccessGroup(this.accessGroupDetails);
    }
  }
  loadAccessGroupForm() {
    this.accessGroupForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())],
      ],
      description: [''],
      status: ['Active']
    })
  }


  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  source: Array<any>;
  confirmed: Array<any>;
  AccessGroupUserAdd = '';
  disabled = false;

  sourceLeft = true;
  format = {
    all: "Select All",
    none: "Deselect All"
  }

  private sourceAccessUsersGroup: Array<any>;

  private confirmedAccessUsersGroup: Array<any>;

  private confirmedAccessUsersObject() {
    this.key = "id";
    this.display = "userNameAndEmail";
    this.keepSorted = true;
    this.source = this.sourceAccessUsersGroup;
    this.confirmed = this.confirmedAccessUsersGroup;
  }


  doReset() {
    this.sourceAccessUsersGroup = JSON.parse(JSON.stringify(this.accessGroupUsersList));
    this.confirmedAccessUsersGroup = JSON.parse(JSON.stringify(this.confirmedAccessUsersGroupList));
    this.confirmedAccessUsersObject();
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
      o[this.display] = this.AccessGroupUserAdd;
      this.source.push(o);
    } else {
      this.source.push(this.AccessGroupUserAdd);
    }
    this.AccessGroupUserAdd = '';
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

  getAccessGroupUserIds() {
    let accessGroupUser = [];
    if (this.globalService.listOfRow.length == 0 || this.globalService.listOfRow == null || this.globalService.listOfRow == undefined) {
      this.confirmed.map(function (ob) {
        if (ob.id != "null" || ob.id != undefined) {
          ob['id'] = ob.id;
          let Obj = {
            "userId": ob['id'],
          }
          accessGroupUser.push(Obj);
        }
      })
    }
    else {
      let accessGroupUserobj = this.globalService.listOfRow.accessGroupUser;
      let sortedAccessGroupUserList = accessGroupUserobj.sort(function (a, b) { return a.userId - b.userId });
      this.confirmed.map(function (ob) {
        let Obj;
        let match = [];
        sortedAccessGroupUserList.filter(element => {
          if (element.userId == ob.id) {
            match.push(element);
          }
        })
        if (match.length != 0) {
          match.forEach(element => {
            if (element != null) {
              if (element.userId == ob.id) {
                if (ob.id != "null" || ob.id != undefined) {
                  Obj = {
                    "userId": ob.id,
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
            "userId": ob.id,
            "status": "Active",
            "id": null
          }
        }
        accessGroupUser.push(Obj);
      });
    }
    return accessGroupUser;
  }
  previewAccessGroup() {
    this.accessGroupUsersList = []
    this.usersList = [];
    this.accessGroup = this.accessGroupForm.value;
    this.accessGroup.accessGroupUser = this.getAccessGroupUserIds();
    this.globalService.setOrganizationDetail("", this.accessGroup);
    this.globalService.GettingId(this.accessGroup.id);
    this.router.navigate(['../previewAccessGroup'], { relativeTo: this.route });
  }


  // This method is used to get Access group users
  getAccessGroupUsers() {
    this.accessGroupUsersList = this.usersList
    this.accessGroupUsersList.forEach(e => {
      e.userNameAndEmail = e.firstName.concat(" (", e.emailId, ")");
    })
    this.doReset();
  }


  // This method is used to get Access group users
  getAccessGroupUsersConfirmed(accessGroupUsers) {
    let returnObj = [];
    //  this.accessGroupUsersList = this.usersList;
    this.confirmedAccessUsersGroupList = accessGroupUsers;
    if (this.accessGroupUsersList.length != 0 && this.accessGroupUsersList != undefined) {
      this.confirmedAccessUsersGroupList.forEach(o => {
        for (let i = 0; i < this.accessGroupUsersList.length; i++) {
          if (this.accessGroupUsersList[i].id == o.userId) {
            this.accessGroupUsersList[i].userNameAndEmail = this.accessGroupUsersList[i].firstName.concat(" (", this.accessGroupUsersList[i].emailId, ")");
            let Obj = {
              "id": o["userId"],
              "userNameAndEmail": this.accessGroupUsersList[i].userNameAndEmail,
              "status": o["status"],
            }
            returnObj.push(Obj);
            break;
          }
        }
        this.confirmedAccessUsersGroupList = returnObj;
      }),
        //
        this.doReset()
    }
  }


  editAccessGroup(aceesGroupDetails) {
    this.userMovedByAccessGroup = true;
    this.enableReset=false;
    this.getAccessGroupUsersConfirmed(this.accessGroupDetails.accessGroupUser);
    this.accessGroupForm.patchValue({
      id: aceesGroupDetails.id,
      name: aceesGroupDetails.name,
      description: aceesGroupDetails.description,
      status: aceesGroupDetails.status,
    });

  }
  redirectTo() {

  }
  onKey(event: any) {
    let name = this.globalService.doubleHyphen(event);
    if (name) {
      this.accessGroupForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  // Cancel form
  cancelAccessGroupForm() {
    this.enableReset = false;
    this.globalService.id = null;
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  resetAccessGroupForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  formResetConfirm() {
    this.accessGroup = this.accessGroupForm.value;
    if (this.accessGroup.id === null) {
      this.loadAccessGroupForm();
      this.confirmed = [];
      this.userMovedByAccessGroup = false;
      this.enableReset=false;
    }
    else {
      this.loadAccessGroupForm();
      this.editAccessGroup(this.accessGroupDetails);
    }
  }
  formCancelConfirm() {
    this.accessGroupForm.reset();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }



  userMovedByAccessGroup: boolean = false;
  getUserMovedByAccessGroup(event) {

    if (event.length) {
     // this.saveButtonDisableStatus = false;
     this.userMovedByAccessGroup = true;
     this.enableReset=true;

    }
    else {
     // this.saveButtonDisableStatus = true;
     this.userMovedByAccessGroup = false;
     this.enableReset=false;
    }
  }
}
