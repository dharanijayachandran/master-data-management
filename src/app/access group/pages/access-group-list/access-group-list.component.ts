import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AccessGroup } from '../../models/AccessGroup';
import { AccessGroupService } from '../../services/access-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { User } from '../../models/user';
import { MatSort } from '@angular/material/sort';
import { OwnerUserService } from '../../services/ownerUser/owner-user.service';
import { globalSharedService } from 'src/app/shared/globalSharedService';


@Component({
  selector: 'app-access-group-list',
  templateUrl: './access-group-list.component.html',
  styleUrls: ['./access-group-list.component.css']
})
export class AccessGroupListComponent implements OnInit {

  // @ViewChild(LoaderComponent) loader:LoaderComponent;
  displayedColumns: string[] = ['id', 'name', 'accessGroupUser', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) myPaginator: MatPaginator;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  confirmDeleteNotificationGroup: any;
  showLoaderImage = true;
  accessGroups: AccessGroup[];
  @ViewChild(UIModalNotificationPage) modelNotification;
  dataSource: MatTableDataSource<AccessGroup>;
  accessGroupUsers: User[];
  deleteId: number;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      //this.dataSource.sort = this.sort;
    }
  }

  constructor(private accessGroupService: AccessGroupService, private userService: OwnerUserService, private globalService: globalSharedService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.getAccessGroupUsers();
  }


  // This method is used to get access Groups
  getAccessGroups() {
    let organizationId = sessionStorage.getItem("beId");
    this.accessGroupService.getAccessGroups(Number(organizationId))
      .subscribe(
        res => {
          this.showLoaderImage = false;
          if (res != null) {
            if (Array.isArray(res) && res.length) {
              this.accessGroups = res;
              if (this.accessGroups.length != 0 && this.accessGroups != undefined) {
                this.setRequiredFormat();
              }
              this.accessGroups = this.accessGroups.sort((a, b) => b.id - a.id);
              // this.dataSource = new MatTableDataSource();
              this.dataSource.data = this.accessGroups;


              // To get paginator events from child mat-table-paginator to access its properties
              // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
              // this.matTablePaginator(this.myPaginator);

              this.dataSource.paginator = this.myPaginator;
              this.dataSource.sort = this.sort;
            } else {
              //   this.dataSource = new MatTableDataSource();
              this.dataSource.data = res;
            }
          }
          else {
            res = [];
            this.showLoaderImage = false;
            // this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;
          }
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  setRequiredFormat() {

    this.accessGroups.forEach(e => {
      let userNames = []
      e.accessGroupUser.forEach(obj => {
        if (this.accessGroupUsers.length != 0 && this.accessGroupUsers != undefined) {
          for (let i = 0; i < this.accessGroupUsers.length; i++) {
            if (this.accessGroupUsers[i].id == obj.userId) {
              userNames.push(this.accessGroupUsers[i].firstName);
              break;
            }
          }
        }
      })
      e.accessGroupUserNames = userNames
    })
  }

  // This method is used to get access group users
  getAccessGroupUsers() {
    let organizationId = sessionStorage.getItem("beId");
    this.userService.getUserListByBeId(Number(organizationId))
      .subscribe(
        res => {
          this.accessGroupUsers = res;
          this.globalService.setUsersList(this.accessGroupUsers);
          this.getAccessGroups();
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // Click to View
  clickToView(accessGroup) {
    this.router.navigate(['../access-group/view', accessGroup.id], { relativeTo: this.route });
    this.globalService.setOrganizationDetail("", accessGroup)
  }


  updateAccessGroup(accessGroup) {
    this.globalService.setId(accessGroup.id);
    this.globalService.setOrganizationDetail("", accessGroup)
    //
  }
  addAccessGroup() {
    let accessGroup = this.globalService.listOfRow;
    this.globalService.listOfRow = [];
  }

  deleteAccessGroup(id: number) {
    this.deleteId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Access Group!');
  }

  // confirmDelete
  confirmDelete() {
    let userId = sessionStorage.getItem("userId");
    this.accessGroupService.deleteAccessGroup(this.deleteId, Number(userId)).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }
  refreshTableListFunction() {
    this.getAccessGroupUsers();
  }


  /*
  Material table paginator code starts here
*/
 // myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

}
