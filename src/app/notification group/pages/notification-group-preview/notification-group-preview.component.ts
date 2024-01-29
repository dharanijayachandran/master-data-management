import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { NotificationGroup } from '../../model/NotificationGroup';
import { NotificationGroupService } from '../../services/notification group/notification-group/notification-group.service';

@Component({
  selector: 'app-notification-group-preview',
  templateUrl: './notification-group-preview.component.html',
  styleUrls: ['./notification-group-preview.component.css']
})
export class NotificationGroupPreviewComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  notificationGroup: NotificationGroup;
  showLoaderImage=false;
  constructor(private globalService: globalSharedService, private notificationGroupService: NotificationGroupService) { }

  ngOnInit() {
  }

  // Save & Update NotificationGroup
  createNotificationGroup(): void {
    this.showLoaderImage=true;
    this.notificationGroup = this.globalService.listOfRow
    delete this.notificationGroup.timeZone
    this.notificationGroup.organizationId = Number(sessionStorage.getItem("beId"));
    if (this.notificationGroup.id == null || this.notificationGroup.id == undefined) {
      this.notificationGroup.createdBy = Number(sessionStorage.getItem("userId"));
      this.notificationGroupService.createNotificationGroup(this.notificationGroup).subscribe(res => {
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.notificationGroup.updatedBy = Number(sessionStorage.getItem("userId"));
      this.notificationGroupService.updateNotificationGroup(this.notificationGroup).subscribe(res => {
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage = false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  redirectTo() {
    this.navigateTemplate.emit('notification-group');
  }



  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    this.navigateTemplate.emit('notification-group-form');
  }

}
