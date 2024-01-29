import { Component, OnInit } from '@angular/core';
import { NgbTabset, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
  providers: [
    NgbTabset
  ]
})
export class ModuleComponent implements OnInit {

  ngOnInit(): void {

  }


  constructor(public tabset: NgbTabset, private globalService:globalSharedService) { }

  gettingModuleDetail = {};

  receiveMessage($event) {
    this.gettingModuleDetail = $event
  }

  // ngAfterViewInit() {
  //   let getTabClicked = this.globalService.tabClick;
  //   if(getTabClicked != undefined || getTabClicked != null){
  //     let tabClick= document.getElementById(getTabClicked);
  //     tabClick.click();
  //     setTimeout(()=>{
  //       this.globalService.tabClick = null;
  //     },1000);
  //   }
  // }
  ngAfterViewInit() {
    if (this.globalService.name != null) {
      this.tabNameMessage();
      let myTab = document.getElementById(this.globalService.name);
      myTab.click();
    }
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
    if ($event.nextId === 'mngService' && !this.isEnableSwitchTab){
      $event.preventDefault();
    }
  }

}
