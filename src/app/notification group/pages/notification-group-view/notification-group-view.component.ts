import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-group-view',
  templateUrl: './notification-group-view.component.html',
  styleUrls: ['./notification-group-view.component.css']
})
export class NotificationGroupViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() navigateTemplate = new EventEmitter();
  // backButton form level
  backButton() {
    this.navigateTemplate.emit('notification-group');
  }
}
