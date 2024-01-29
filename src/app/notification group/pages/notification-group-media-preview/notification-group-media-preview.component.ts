import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { NotificationGroupMedia } from '../../model/NotificationGroupMedia';
import { NotificationGroupMediaService } from '../../services/notification group/notification-group-media/notification-group-media.service';

@Component({
  selector: 'app-notification-group-media-preview',
  templateUrl: './notification-group-media-preview.component.html',
  styleUrls: ['./notification-group-media-preview.component.css']
})
export class NotificationGroupMediaPreviewComponent implements OnInit {
  showLoaderImage = false;
  @ViewChild(UIModalNotificationPage) modelNotification;
  notificationGroupMedia: NotificationGroupMedia;
  notificationMediaId: number;
  constructor(private globalService: globalSharedService, private notificationGroupMediaService: NotificationGroupMediaService) { }

  ngOnInit() {
  }

  // Save & Update NotificationGroupMedia
  createNotificationGroupMedia(): void {
    this.showLoaderImage = true;
    let notificationGroupMediaId = this.globalService.globalId;
    this.notificationGroupMedia = this.globalService.notificationGroupmediaDetails;
    this.notificationMediaId = this.notificationGroupMedia.notificationMediaId;
    this.notificationGroupMedia.createdBy = Number(sessionStorage.getItem("userId"));
    this.notificationGroupMedia.notificationGroupMediaEntity.forEach(element => {
      element.createdBy = Number(sessionStorage.getItem("userId"));
      element.updatedBy = Number(sessionStorage.getItem("userId"));
      element.notificationGroupMediaId = notificationGroupMediaId;
    })
    this.notificationGroupMediaService.createNotificationGroupMedia(this.notificationGroupMedia).subscribe(res => {
      this.showLoaderImage = false;
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

  @Output() navigateTwoLevelUpDisplayPage = new EventEmitter();
  redirectTo() {
    //this.navigateTwoLevelUpDisplayPage.emit('notification-group');
    //let mngGroup = document.getElementById('mngGroup');
    //mngGroup.click();
    this.globalService.setNotificationMediaTabDetails(this.notificationMediaId);
    this.navigateTemplate.emit('notification-group-media-form');
  }
  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    this.globalService.setBackId("backId")
    this.navigateTemplate.emit('notification-group-media-form');
  }
}
