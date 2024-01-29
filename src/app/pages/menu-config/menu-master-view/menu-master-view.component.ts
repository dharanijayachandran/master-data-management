import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/services/menu/menu.service';


@Component({
  selector: 'app-menu-master-view',
  templateUrl: './menu-master-view.component.html',
  styleUrls: ['./menu-master-view.component.css']
})
export class MasterMenuViewComponent implements OnInit, AfterViewInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  @ViewChild('config') config: PerfectScrollbarComponent;

  menuReadModeView = false;

  menuListView = true;


  treeControl = new NestedTreeControl<Menu>(node => node.menus);
  dataSource: any;


  hasChild = (_: number, node: Menu) => !!node.menus && node.menus.length > 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showLoaderImage = false;
  visibleNodes: Menu[];
  noRecordBlock = false;


  // Mapping TreeView fields property with data source properties
  constructor(private globalService: globalSharedService, private menuService: MenuService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.showLoaderImage = true;
    this.getMenus();
  }
  masterMenuListHeader;
  ngAfterViewInit() {
    this.masterMenuListHeader = sessionStorage.getItem("userName");

  }

  addMenuItems() {
    this.globalService.setOrganizationDetail('', this.dataSource.data);
  }
  // Add Menu
  addChildMenuItems(masterMenuDetail) {
    if (masterMenuDetail.level < 4 || masterMenuDetail.level == 1) {
      if (!masterMenuDetail.pageUrl) {
        this.menuService.GettingParentId(masterMenuDetail.id);
        this.globalService.setOrganizationDetail('', masterMenuDetail);
        this.router.navigate(['../menu-master/masterMenuForm']);
      }
    }
  }

  updateLevels(list, index) {
    var that = this;
    return list.map(function (d, i) {
      d.level = index;
      if (d.menus && d.menus.length) {
        d.menus = that.updateLevels(d.menus, index + 1);
      }
      return d;
    });
  }

  // Update menu
  UpdateMenu(masterMenuDetail: Menu) {
    this.globalService.GettingId(masterMenuDetail.id);
    this.globalService.dataSource(this.dataSource.data);
    this.dataSource.data.forEach((item) => {
      let menu = this.getSubMenus(masterMenuDetail.id, item);
      if (menu) {
        this.globalService.setMenuDetail(menu);
      }
    })
    this.router.navigate(['../menu-master/masterMenuForm']);
    // if (masterMenuDetail.parentMenuId === null || masterMenuDetail.parentMenuId === undefined) {
    //   this.globalService.dataSource(this.dataSource.data);
    //   this.dataSource.data.forEach((item) => {
    //     let menu = this.getSubMenus(masterMenuDetail.id, item);
    //     if (menu) {
    //       this.globalService.setMenuDetail(menu);
    //     }
    //   })
    // }
    // else {
    //   this.dataSource.data.forEach((item) => {
    //     let menu = this.getSubMenus(masterMenuDetail.id, item);
    //     if (menu) {
    //       this.globalService.setMenuDetail(menu);
    //     }
    //   })
    // }
    //this.globalService.setOrganizationDetail('', masterMenuDetail);
  }


  // Find Parent/Sub parent Menus
  getSubMenus(id, o) {
    //Early return
    if (o.id === id) {
      return o;
    }
    var result, p;
    if (o.menus.length) {
      for (p in o.menus) {
        result = this.getSubMenus(id, o.menus[p]);
        if (result) {
          return result;
        }
      }
    }
    return result;
  }



  refreshTableListFunction() {
    this.getMenus();
  }

  getMenus() {
    this.menuService.getMenuList()
      .subscribe(
        res => {
          this.showLoaderImage = false;
          if (Array.isArray(res) && res.length) {
            this.dataSource = new MatTreeNestedDataSource<Menu>();
            this.dataSource.data = Array.isArray(res) && res.length ? res.sort((a, b) => a.menuItemOrder - b.menuItemOrder) : [];
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource.data = this.updateLevels(this.dataSource.data, 1);
            this.traverseDown(this.dataSource.data);
            this.treeControl.dataNodes = this.dataSource.data;
          } else {
            this.noRecordBlock = true;
          }
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  /* Set visible value to all childrens of passed tree */
  traverseDown(o) {
    try {
      for (let i in o) {
        o[i]["visible"] = true;
        if (o[i]["menus"].length > 0) this.traverseDown(o[i]["menus"]);
      }
    } catch (err) {
      //TODO: Handle exception
    }
  }


  hasNestedChild = (_: number, nodeData) => { return nodeData.children.length }

  // User search
  filterChanged(filterText: string) {
    this.applyFilter(this.treeControl.dataNodes, filterText);
    this.visibleNodes = this.treeControl.dataNodes.filter(
      node => node.visible === true);
    if (this.visibleNodes.length == 0) {
      this.noRecordBlock = true;
    } else {
      this.noRecordBlock = false;
    }
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  // Filtering the Nodes by user input
  applyFilter(list, searchString) {
    const that = this;
    let isSubMenusVisible;
    return list.map(function (d) {
      isSubMenusVisible = null;
      if (d.menus && d.menus.length) {
        d.menus = that.applyFilter(d.menus, searchString);
        isSubMenusVisible = d.menus.filter(function (sm) {
          return sm.visible;
        });
      }
      d.visible = d.name.toLowerCase().includes(searchString.toLowerCase()) || (isSubMenusVisible && isSubMenusVisible.length > 0 ? true : false);
      return d;
    });
  }

  /* Get the parent node of a node */
  getParentNode(node: Menu): Menu | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getLevel = (node: Menu) => { return node.level; };

  // enable and disable add menus(plus) - if page url entered then disabled and if already created four level
  // menu then disable plus button
  checkPageUrlLength(node) {
    if (node.hasOwnProperty('pageUrl')) {
      if (node.pageUrl.length != 0) {
        return true
      } else return false;
    }
  }

}
