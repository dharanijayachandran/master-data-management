import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-notification-group',
  templateUrl: './notification-group.component.html',
  styleUrls: ['./notification-group.component.css'], providers: [
    NgbTabset
  ]
})
export class NotificationGroupComponent implements OnInit, AfterViewInit {
  isEnableSwitchTab = false;
  constructor(public tabset: NgbTabset, private globalService: globalSharedService,
  ) { }
  ngAfterViewInit() {
    let getTabClicked = this.globalService.tabClick;
    if (getTabClicked != undefined || getTabClicked != null) {
      this.tabNameMessage();
      let tabClick = document.getElementById(getTabClicked);
      tabClick.click();
      setTimeout(() => {
        this.globalService.tabClick = null;
      }, 1000);
    }
  }

  displayPage = '';


  ngOnInit() {
    this.displayPage = "notification-group";
  }

  onChange(){
    this.displayPage = "notification-group";
  }

  gettingDisplayPage($event){
    this.displayPage = $event;
  }

  // To navigate based on click form tab or action place
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
    if ($event.nextId === 'mngAnonymousContact' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }

}
