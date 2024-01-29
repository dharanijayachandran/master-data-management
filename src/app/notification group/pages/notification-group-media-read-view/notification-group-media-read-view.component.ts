import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { NotificationGroupMedia } from '../../model/NotificationGroupMedia';

@Component({
  selector: 'app-notification-group-media-read-view',
  templateUrl: './notification-group-media-read-view.component.html',
  styleUrls: ['./notification-group-media-read-view.component.css']
})
export class NotificationGroupMediaReadViewComponent implements OnInit {
  notificationGroupMedia:NotificationGroupMedia;

  constructor(private globalService: globalSharedService) { }
  ngOnInit() {
    this.notificationGroupMedia = this.globalService.notificationGroupmediaDetails;
  }

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton() {
    this.globalService.GettingId(this.globalService.listOfRow.id);
    this.globalService.setNotificationGroupmediaDetails(this.notificationGroupMedia);
    this.navigateTemplate.emit('notification-group-media-form');
  }

}
