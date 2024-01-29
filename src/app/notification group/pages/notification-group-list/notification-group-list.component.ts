import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/access group/models/user';
import { OwnerUserService } from 'src/app/access group/services/ownerUser/owner-user.service';
import { NotificationGroup } from '../../model/NotificationGroup';
import { NotificationMedia } from '../../model/NotificationMedia';
import { NotificationGroupService } from '../../services/notification group/notification-group/notification-group.service';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/globalSharedService';

@Component({
  selector: 'app-notification-group-list',
  templateUrl: './notification-group-list.component.html',
  styleUrls: ['./notification-group-list.component.css']
})
export class NotificationGroupListComponent implements OnInit {
  notificationGroupUsersList: User[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(UIModalNotificationPage) modelNotification;
  //@ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;


  // @ViewChild(LoaderComponent) loader:LoaderComponent;
  displayedColumns: string[] = ['id', 'name', 'notificationMedia', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) myPaginator: MatPaginator;
  notificationMediaList: NotificationMedia[] = [];
  notificationGroupsList: NotificationGroup[] = [];
  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  confirmDeleteNotificationGroup: any;
  showLoaderImage = true;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  constructor(private notificationGroupService: NotificationGroupService, private userService: OwnerUserService, private globalService: globalSharedService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) ||
        data.notificationMediaName.toString().toLowerCase().includes(filter) ||
        data.status.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.getNotificationMedia();
    this.getNotificationGroups();
    this.getNotificationGroupUsers();
  }

  refreshTableListFunction() {
    this.getNotificationMedia();
    this.getNotificationGroups();
    this.getNotificationGroupUsers();
  }
  // This method is used to get Notification Groups
  getNotificationGroups() {
    let organizationId = sessionStorage.getItem("beId");
    this.notificationGroupService.getNotificationGroups(Number(organizationId))
      .subscribe(
        res => {
          res.forEach(mediaGroup => {
            if (!mediaGroup.notificationMediaName) {
              mediaGroup.notificationMediaName = [];
            }
          })
          this.showLoaderImage = false;
          if (res != null) {
            if (Array.isArray(res) && res.length) {
              this.notificationGroupsList = res;
              this.setRequiredFormat();
              this.notificationGroupsList = this.notificationGroupsList.sort((a, b) => b.id - a.id);
              //this.dataSource = new MatTableDataSource();
              this.dataSource.data = this.notificationGroupsList;

              // To get paginator events from child mat-table-paginator to access its properties
              // this.myPaginator = this.myPaginatorChildComponent.getDatasource();
              // this.matTablePaginator(this.myPaginator);

              this.dataSource.paginator = this.myPaginator;
              this.dataSource.sort = this.sort;
            } else {
              // this.dataSource = new MatTableDataSource();
              this.dataSource.data = res;
            }
          }
          else {
            res = [];
            //  this.dataSource = new MatTableDataSource();
            this.dataSource.data = res;
          }
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  setRequiredFormat() {

    this.notificationGroupsList.forEach(e => {
      let mediaNames = []
      if (e.notificationGroupMedia.length != 0) {
        e.notificationGroupMedia.forEach(obj => {
          this.notificationMediaList.forEach(element => {
            if (element.id == obj.notificationMediaId) {
              mediaNames.push(element.name);;
            }
          })
        })
      }
      e.notificationMediaName = mediaNames
    })
  }
  // This method is used to get Notification media
  getNotificationMedia() {
    this.notificationGroupService.getNotificationMedia()
      .subscribe(
        res => {
          if (res != null) {
            let getDatsource = res;
            this.notificationMediaList = getDatsource.sort((a, b) => a.id - b.id);
            this.globalService.setNotificationMedia(this.notificationMediaList);
          }
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // This method is used to get Notification group users
  getNotificationGroupUsers() {
    let organizationId = sessionStorage.getItem("beId");
    this.userService.getUserListByBeId(Number(organizationId))
      .subscribe(
        res => {
          this.notificationGroupUsersList = res;
          this.globalService.setUsersList(this.notificationGroupUsersList);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // This method is used to navigate to form page
  @Output() navigateTemplate = new EventEmitter();
  addNotificationGroup() {
    this.globalService.setId(null);
    this.globalService.listOfRow = {};
    this.navigateTemplate.emit('notification-group-form');
  }

  // Click to View
  clickToView(notificationGroupDetail) {
    this.notificationGroupObject(notificationGroupDetail);
    this.navigateTemplate.emit('notification-group-View');
  }
  // Common function for setting ID and notificationGroup object
  notificationGroupObject(notificationGroupDetail) {
    this.globalService.setId(notificationGroupDetail.id);
    this.globalService.setOrganizationDetail('', notificationGroupDetail);
  }

  // Update  notificationGroup object
  udateNotificationGroup(notificationGroupDetail) {
    this.globalService.setNotificationGroupDetails(notificationGroupDetail);
    this.notificationGroupObject(notificationGroupDetail);
    this.navigateTemplate.emit('notification-group-form');

  }
  deleteNotificationGroup(id: number) {
    this.confirmDeleteNotificationGroup = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Notification Group!');
  }

  confirmDelete() {
    let userId = sessionStorage.getItem('userId');
    this.notificationGroupService.deleteNotificationGroup(this.confirmDeleteNotificationGroup, Number(userId)).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error: any) => {
      // If the service is not available
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }
  // Manage anonymousContact By NotificationGroup
  @Output() tabName = new EventEmitter<string>();
  anonymousContactByNotificationGroup(notificationGroupDetail) {
    this.notificationGroupObject(notificationGroupDetail);
    //
    this.tabName.emit('mngAnonymousContact');
    this.navigateTemplate.emit('notification-group-media');
    let mngAnonymousContact = document.getElementById('mngAnonymousContact');
    mngAnonymousContact.click();
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
