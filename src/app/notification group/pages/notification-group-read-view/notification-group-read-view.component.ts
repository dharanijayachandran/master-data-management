import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TimeZone, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { NotificationGroup } from '../../model/NotificationGroup';
import { NotificationGroupUser } from '../../model/NotificationGroupUser';
import { NotificationMedia } from '../../model/NotificationMedia';
import { NotificationGroupService } from '../../services/notification group/notification-group/notification-group.service';

@Component({
  selector: 'app-notification-group-read-view',
  templateUrl: './notification-group-read-view.component.html',
  styleUrls: ['./notification-group-read-view.component.css']
})
export class NotificationGroupReadViewComponent implements OnInit {
  @ViewChild(UIModalNotificationPage) modelNotification;
  notificationGroup: NotificationGroup;
  NotificationGroupusersList: NotificationGroupUser[];
  notificationMediaList: NotificationMedia[];
  notificationMediaListObj: any;
  notificationMediaListName: any[];
  notificationMediaListNameObj: any[];
  timeZoneList: TimeZone[] = [];
  timezoneMap = new Map();


  constructor(private globalService: globalSharedService, private globalSharedService: globalSharedService, private notificationGroupService: NotificationGroupService,) { }
  ngOnInit() {
    this.notificationGroup = this.globalService.listOfRow;
    this.getTimeZoneList();
    this.NotificationGroupusersList = this.globalService.usersList;
    this.notificationMediaList = this.globalService.notificationMediaList;
    this.notificationMediaListName = this.globalService.listOfRow.notificationMediaName;
    this.notificationMediaListObj = this.globalService.listOfRow.notificationMediaList;
    this.notificationMedia(this.notificationMediaList, this.notificationMediaListName, this.notificationMediaListObj);
  }
  notificationMedia(notificationMediaList: NotificationMedia[], notificationMediaListName: any[], notificationMediaListObj: any) {
    if (notificationMediaListName != null || notificationMediaListName != undefined) {
      this.notificationMediaListNameObj = notificationMediaListName;
    } else {
      this.notificationMediaListNameObj = [];
      notificationMediaList.forEach(notificationMediaList => {
        notificationMediaListObj.forEach(notificationMediaListObj => {
          if (notificationMediaList.id == notificationMediaListObj.id) {
            if (notificationMediaListObj.isChecked === true) {
              this.notificationMediaListNameObj.push(notificationMediaList.name);
            }
          }
        });
      })
    }
  }

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton() {
    this.globalService.GettingId(this.globalService.listOfRow.id);
    this.navigateTemplate.emit('notification-group-form');
  }
  getTimeZoneList() {
    this.notificationGroupService.getTimeZoneList().subscribe(
      res => {
        res.forEach(obj => {
          this.timezoneMap.set(obj.id, obj.name);
        })
        if (this.notificationGroup.timeZone == undefined) {
          let timezoneId = this.notificationGroup.timeZoneId
          if (this.timezoneMap.has(timezoneId)) {
            let timezone = this.timezoneMap.get(timezoneId)
            this.notificationGroup.timeZone = timezone
          }

        }

      },

      (error: any) => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      }
    );

  }

}
