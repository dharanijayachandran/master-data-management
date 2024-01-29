import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationMedia } from '../../model/NotificationMedia';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationGroup } from '../../model/NotificationGroup';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-notification-group-media',
  templateUrl: './notification-group-media.component.html',
  styleUrls: ['./notification-group-media.component.css']
})
export class NotificationGroupMediaComponent implements OnInit {
  notificationMediaList: NotificationMedia[] = [];
  notificationGroup: NotificationGroup;
  notificationGroupMediaTabForm: FormGroup;
  displayPage = '';
  constructor(public formBuilder: FormBuilder, private globalService: globalSharedService) { }

  ngOnInit(): void {
    this.displayPage = 'notification-group-media-form';
    this.notificationGroup = this.globalService.listOfRow;
    this.getNotificationMedia();
    this.loadNotificationGroupForm();
  }

  loadNotificationGroupForm() {
    this.notificationGroupMediaTabForm = this.formBuilder.group({
      notificationGroupName: [null],
    })
    this.notificationGroupMediaTabForm.patchValue({
      notificationGroupName: this.notificationGroup.name

    })
  }
  getNotificationMedia() {
    this.globalService.notificationMediaList.forEach(e => {
      this.notificationGroup.notificationGroupMedia.forEach(element => {
        if (e.id == element.notificationMediaId)
          this.notificationMediaList.push(e);
      })
    })
  }
  onChange(notificationMedia) {
    this.globalService.setNotificationMediaTabDetails(notificationMedia.id);
  }

  gettingDisplayPage($event) {
    this.displayPage = $event;
  }

  @Output() navigateTemplate = new EventEmitter();
  // Two level up from the child component
  navigateTwoLevelUpGettingDisplayPage($event) {
    this.navigateTemplate.emit($event);
  }

}
