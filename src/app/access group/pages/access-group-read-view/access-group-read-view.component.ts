import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/globalSharedService';

import { AccessGroup } from '../../models/AccessGroup';
import { User } from '../../models/user';

@Component({
  selector: 'app-access-group-read-view',
  templateUrl: './access-group-read-view.component.html',
  styleUrls: ['./access-group-read-view.component.css']
})
export class AccessGroupReadViewComponent implements OnInit {
  accessGroup: AccessGroup;
  accessGroupUsers: User[];




  constructor(private globalService: globalSharedService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {

    this.accessGroup = this.globalService.listOfRow
    this.accessGroupUsers = this.globalService.usersList;
  //  this.setRequiredFormat();

  }

  // backButton navigate to form view
  backButton() {
    this.router.navigate(['../addAccessGroup'], { relativeTo: this.route });
  }

  setRequiredFormat() {

    let userNames = []
    this.accessGroup.accessGroupUser.forEach(obj => {
      if (this.accessGroupUsers.length != 0 && this.accessGroupUsers != undefined) {
        for (let i = 0; i < this.accessGroupUsers.length - 1; i++) {
          if (this.accessGroupUsers[i].id == obj.userId) {
            userNames.push(this.accessGroupUsers[i].firstName);
            break;
          }
        }
      }
    })
    this.accessGroup.accessGroupUserNames = userNames
  }
}
