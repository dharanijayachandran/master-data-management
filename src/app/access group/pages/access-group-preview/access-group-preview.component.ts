import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';

import { AccessGroup } from '../../models/AccessGroup';
import { AccessGroupService } from '../../services/access-group.service';

@Component({
  selector: 'app-access-group-preview',
  templateUrl: './access-group-preview.component.html',
  styleUrls: ['./access-group-preview.component.css']
})
export class AccessGroupPreviewComponent implements OnInit {
   // Importing child component to
   @ViewChild(UIModalNotificationPage) modelNotification;

  showLoaderImage=false;
  accessGroup: AccessGroup;
  constructor(private globalService: globalSharedService,private router: Router,private accessGroupService: AccessGroupService,private route:ActivatedRoute) { }

  ngOnInit() {
  }

  // Save & Update NotificationGroup
  createAccessGroup(): void {
    this.showLoaderImage=true;
    this.accessGroup = this.globalService.listOfRow
    this.accessGroup.organizationId = Number(sessionStorage.getItem("beId"));
    if (this.accessGroup.id == null || this.accessGroup.id == undefined) {
      this.accessGroup.createdBy = Number(sessionStorage.getItem("userId"));
      this.accessGroupService.createAccessGroup(this.accessGroup).subscribe(res => {
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
      this.accessGroup.updatedBy = Number(sessionStorage.getItem("userId"));
      this.accessGroupService.updateAccessGroup(this.accessGroup).subscribe(res => {
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
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  // backButton navigate to form view

  backButton(event) {
    this.router.navigate(['../addAccessGroup'],{relativeTo:this.route});
  }

}
