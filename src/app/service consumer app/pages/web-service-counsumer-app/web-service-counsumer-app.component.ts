import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-web-service-counsumer-app',
  templateUrl: './web-service-counsumer-app.component.html',
  styleUrls: ['./web-service-counsumer-app.component.css']
})
export class WebServiceCounsumerAppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // To navigate based on click form tab or action place
  isEnableSwitchTab = false;
  tabNameMessage() {
    this.isEnableSwitchTab = true;
    this.isEnableSwitchTabStatus();
  }

  // isEnableSwitch status false after one second
  isEnableSwitchTabStatus() {
    setTimeout(() => {
      this.isEnableSwitchTab = false;
    }, 500);
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'assignService' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }

}
