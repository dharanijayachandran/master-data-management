import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { Menu } from 'src/app/model/menu';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { IconService } from '../../../services/icon/icon.service';
import { ApplicationService } from 'src/app/services/application/application.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-menu-master-form',
  templateUrl: './menu-master-form.component.html',
  styleUrls: ['./menu-master-form.component.css']
})
export class MenuMasterFormComponent implements OnInit {

  //application [field]
  public applicationfield:Object={
    text:'name',value:'id'
  }
  //icon [field]
  public iconFields: Object = {
    text: 'displayName',
    iconCss: 'name',
    value: 'id'
  };
  // set the placeholder to DropDownList input element
  public iconWaterMark: string = 'Select Menu Icon';
  // set the placeholder to filter search box input element
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '200px';
  public sort: string = 'Ascending';
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('displayName', 'contains', e.text, true) : query;
    e.updateData(this.icons, query);
  }

  //application filter data source,
  public onFilterings: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(this.applications, query);
  }

  pageUrlCheckDisabled: boolean;
  PageUrlCheckToolTip = "Click to enable/Disable";
  applicationName: any;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.menuForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  menu: Menu = new Menu();
  menuForm: FormGroup;
  isPageUrl = true;
  pageUrlCheck = false;
  parentMenu = false;
  addEditText: string;
  editable = false;
  hiddenCondition = false;
  menuFormView = true;
  menuReadModeView = false;
  icons = [];
  applications=[];
  selectedIcon;
  selectedApplication;
  createMenu: Menu;
  menuItemOrderArray = [];
  warningFlag: string;
  showLoaderImage = false;
  iconId: any;
  applicationId :any;
  public applicationWaterMark: string = 'Select Application Name';
  public sortDropDown: string = 'Ascending';

  constructor(private formBuilder: FormBuilder, private menuService: MenuService,
    private iconService: IconService, private globalService: globalSharedService,private applicationService : ApplicationService,
    private router: Router, private dialogService: DialogService,
    private route: ActivatedRoute) { }

  public locale: string;
  ngOnInit() {
    this.locale = this.globalService.getLanguage();
    this.menuFormRegister();
    let id = Number(this.globalService.selectedId);
    this.getApplications();
    let parentMenuId = Number(this.menuService.parentMenuId);
    if (id != 0){
      this.addEditText = "Edit";
      var menus: Menu[] = this.globalService.dataDataSource;
      this.setMenuItemOrderDropDown(menus);
      this.addChildMenuItems(id);
    }
    else if (parentMenuId != 0) {
      this.parentMenu = false;
      this.addEditText = 'Add';
      var menu: Menu = this.globalService.listOfRow;
      this.setMenuItemOrderDropDown(menu.menus);
      this.childMenu(this.globalService.listOfRow);
      this.getIcons();
    }
    else {
      this.addEditText = 'Add';
      var menus: Menu[] = this.globalService.listOfRow;
      this.setMenuItemOrderDropDown(menus);
      this.newMenuAdd();
      this.getIcons();
    }
  }

  /* setMenuItemOrderDropDown(listOfRow: any) {
    var menus: Menu[] = listOfRow;
    this.menuItemOrderArray = Array.from(Array(50).keys()).map(x => ++x);
    menus.forEach(menu => {
      this.menuItemOrderArray = this.menuItemOrderArray.filter(menuOrder => menuOrder !== menu.menuItemOrder);
    })
  } */

  setMenuItemOrderDropDown(menus: Menu[]) {
    var menuItemOrderArray = Array.from(Array(100).keys()).map(x => ++x);
    menuItemOrderArray.forEach(menuItemOrder => {
      let dropdownNumber = new MenuItemOrderNumber();
      dropdownNumber.number = menuItemOrder;
      menus.forEach(menu => {
        if (menuItemOrder === menu.menuItemOrder) {
          dropdownNumber.isDisabled = true;
          return;
        }
      })
      this.menuItemOrderArray.push(dropdownNumber);
    })
  }

  onClick() {
    alert('Disabled');
  }

  newMenuAdd() {
    this.menuFormMethod();
    this.parentMenu = true;
    this.hiddenCondition = true;
    this.editable = true;
  }
  // UpdateMenu
  addChildMenuItems(id: number) {
    this.menuFormMethod();
    this.getMenuInfoById(id);
    this.parentMenu = false;
    this.hiddenCondition = false;
    this.editable = false;
    this.isPageUrl = true;
    this.getMenuById(id);
    if (!this.isPageUrl) {
    }
  }

  menuFormMethod() {
    this.menuForm.get('pageUrl').setValidators(null);
    this.menuForm.get('pageUrl').updateValueAndValidity();
    // this.menuForm.reset();
  }

  getMenuInfoById(id: number) {
    this.menuService.getMenuListByMenuId(id).subscribe((menu: Menu) => this.childMenu(menu),
      (error: any) => { }
    );
  }

  childMenu(menu: Menu) {
    this.menuForm.patchValue({
      parentMenuName: menu.name,
      parentMenuId: menu.id
    });
  }

  menuFormRegister() {
    this.menuForm = this.formBuilder.group({
      id: [null],
      parentMenuId: [],
      iconId: [null, Validators.required],
      iconName: [null],
      applicationId: [null, Validators.required],
      parentMenuName: [null],
      description: [null],
      pageUrl: [null],
      pageUrlCheck: false,
      name: [[null], [
        Validators.required,
        Validators.pattern(this.globalService.getNamePattern())]],
      menuItemOrder: [null, Validators.required],
      menuItemOrderName: [null],
      status: ['Active']
    });
  }

  // Not allow space as the first character
  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  //application service
  getApplications(menu?){
    let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
    this.applicationService.getApplicationList(isSystemAdmin).subscribe(result =>{
      let data = this.getFormattedAssetList(result);
      this.applications = data;
    },
    error => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    });
}

getFormattedAssetList(list) {
  let isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
    if(isSystemAdmin == 'true'){
    return list.map(function (l) {
      return {
        id: l.id,
        name: l.name,
        code: l.code
      };
    });
  }
  if(isSystemAdmin == 'false'){
    return list.map(function (l) {
      return {
        id: l.application.id,
        name: l.application.name,
        code: l.application.code
      };
    });
  }
  }

//icon service
  getIcons(menu?) {
    this.iconService.getIconsList().subscribe(res => {
      this.icons = res;
      if (this.menuForm.controls['iconId'].value) {
        this.getIconName(this.menuForm.controls['iconId'].value);
      } else {
        this.menuForm.controls['iconId'].setValue(null);
      }
      if(menu.applicationId){
        this.getApplicationName(menu.applicationId);
      }
      if (menu != undefined || menu != null) {
        this.editMenu(menu);
        let status = this.menuForm.controls['status'].value;
        if (status == "In_Active") {
          this.menuForm.controls['status'].setValue("In-Active");
        }
      }

    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  // To preview page icon name to show, when response comes form API
  getIconName(iconId) {
    this.selectedIcon = this.icons.filter((e) => {
      return e.id == iconId;
    })
    this.menuForm.controls['iconName'].setValue(this.selectedIcon[0].displayName);
  }

  iconOnChange($event) {
    if ($event.value) {
      this.menuForm.controls['iconName'].setValue($event.itemData.displayName);
    }
  }
 //application
  getApplicationName(applicationId){
    this.applications.forEach(data =>{
      if(data.id == applicationId){
        return this.applicationName  = data.name;
      }
    })
  }
  //application change event
  applicationOnChange($event) {
    if ($event.value) {
      this.menuForm.controls['applicationId'].setValue($event.itemData.id);
  }
}
  // Order Change event
  orderOnChange($event) {
    this.menuForm.controls['menuItemOrderName'].setValue($event.target.options[$event.target.options.selectedIndex].text);
  }

  previewMenu() {
    this.getApplicationName(this.menuForm.value.applicationId);
    this.menu = <Menu>this.menuForm.value;
    this.menuFormView = false;
    this.menuReadModeView = true;
    this.createMenu = Object.assign({}, this.menu);
    delete this.createMenu['menuItemOrderName'];
    delete this.createMenu['iconName'];
    delete this.createMenu['applicationName'];
  }

  saveMenuInfo(): void {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem("userId");
    if (this.menu.status == "In-Active") {
      this.menu.status = "In_Active";
    }
    if (this.menu.id === null) {
      this.menu.createdBy = Number(userId);
      this.menuService.addMenu(this.menu).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.menuFormRegister();
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        })
    }
    else {
      this.menu.updatedBy = Number(userId);
      this.menuService.updateMenu(this.menu).subscribe((res) => {
        this.showLoaderImage = false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.menuFormRegister();
      },
        (error: any) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // redirectTo
  redirectTo() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  cancelMenuForm() {
    this.warningFlag = "cancel";
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // back Button
  backButton(elementId) {
    this.menuFormView = true;
    this.menuReadModeView = false;
    window.scrollTo(0, 0);
    setTimeout(() => {
      if (elementId) {
        let item = document.getElementById(elementId);
        window.scrollBy({ top: item.offsetTop, behavior: 'smooth' })
      }
    });

    if (!this.isPageUrl) {
      this.pageUrlCheck = true;
    } else {
      this.pageUrlCheck = false;
    }

  }

  // Page URL field enable/disabled based on checkbox state
  displayPageUrl(isChecked) {
    if (isChecked.checked) {
      this.menuForm.get('pageUrl').markAsTouched();
      this.menuForm.get('pageUrl').updateValueAndValidity();
      this.menuForm.get('pageUrl').setErrors({
        'required': true
      })

      this.menuForm.get('pageUrl').setValidators(Validators.required);
      this.isPageUrl = false;
      // if(this.menuForm.controls['pageUrl'].value != ""){
      //   return true;
      // }else if(this.menuForm.valid){
      //   this.menuForm.get('pageUrl').setErrors({
      //     'required':true
      //   })
      // }
    }
    else {
      this.isPageUrl = true;
      this.menuForm.controls['pageUrl'].setValue('');
      this.menuForm.controls["pageUrl"].clearValidators();
      this.menuForm.controls["pageUrl"].updateValueAndValidity();
      // this.menuForm.get('pageUrl').setErrors({
      //   'required': false
      // })
    }
  }

  validateInputValue($event) {
    if ($event.target.value.length == 0) {
      // this.menuForm.get('pageUrl').setValidators(Validators.required);
      this.menuForm.get('pageUrl').setErrors({
        'required': true
      })
    }
  }


  resetMenuForm(event) {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  formCancelConfirm() {
    this.isPageUrl = true;
    this.parentMenu = false;
  }

  @ViewChild('ddlelement')
  public dropDownListObject: DropDownListComponent;
  // Form reset  confirm
  formResetConfirm() {
    this.menu = <Menu>this.menuForm.value;
    if (this.menu.id === null) {
      this.pageUrlCheck = false;
      this.menuForm.controls['pageUrlCheck'].setValue(false);
      this.isPageUrl = true;
      this.menuFormRegister();
      // setTimeout(()=>{
      //   this.menuForm.reset();
      // },5)
    }
    else {
      this.menuFormRegister();
      this.getMenuById(this.menu.id);
      // setTimeout(()=>{
      //   this.menuForm.reset();
      // },5)
    }
  }

  getMenuById(id: number) {
    var menufromList = this.globalService.listOfRow;
    // const isArray = menufromList instanceof Array;
    this.menuService.getMenuListByMenuId(id).subscribe((menu: Menu) => {
      if (menu.parentMenuId == null || menu.parentMenuId == undefined) {
        this.parentMenu = true;
        this.inputCheckboxConditionStatusPageURL(menufromList, menu);
      } else {
        this.parentMenu = false;
      }
      this.getIcons(menu);
    //  this.getApplications(menu);
      this.inputCheckboxConditionStatusPageURL(menufromList, menu);

    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  inputCheckboxConditionStatusPageURL(menufromList, menu) {
    // If we click Parent has no child
    // if (menufromList.hasOwnProperty('menus')) {
    if (menufromList.menus && menufromList.menus.length == 0) {
      this.isPageUrl = false;
      if (menufromList.pageUrl && menufromList.pageUrl.length) {
        this.pageUrlCheck = true;
      } else {
        this.pageUrlCheck = false;
      }
    } else {
      this.pageUrlCheckDisabled = true;
      this.PageUrlCheckToolTip = "Disabled";
    }
    // }
  }

  editMenu(menu: Menu) {
    this.menuForm.patchValue({
      id: menu.id,
      description: menu.description,
      pageUrl: menu.pageUrl,
      name: menu.name,
      parentMenuName: menu.parentMenuName,
      createdBy: menu.createdBy,
      menuItemOrder: menu.menuItemOrder,
      parentMenuId: menu.parentMenuId,
      updatedBy: menu.updatedBy,
      iconId: menu.iconId,
      applicationId: menu.applicationId,
      status: menu.status
    });

  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.menuForm.get('name').setErrors({
        pattern: true
      });
    }
  }

}

export class MenuItemOrderNumber {
  number: Number;
  isDisabled: Boolean;
}
