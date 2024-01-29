import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { globalSharedService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { AssetTypeService } from './services/asset-type.service';
import { MatTablePaginatorComponent } from '../shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.css']
})
export class AssetTypeComponent implements OnInit {
  displayPage: string;
  displayError: boolean = false;
  viewPage: boolean = false;
  AssetTypeId;
  displayOrderValidationError: boolean = false;
  dataSource: any;
  showLoaderImage: boolean;
  displayOrderValidation = new RegExp('[0-9]');
  checkedValue;
  validCode = /^[a-zA-Z0-9\-]+$/;
  validCodeErrorMessage: boolean;
  validName = /^[\S]+.*[\S]$/;
  validNameErrorMessage: boolean;

  @ViewChild(UIModalNotificationPage) modelNotification;
  organizationId = sessionStorage.getItem("beId");
  createdBy = sessionStorage.getItem('userId');
  updatedBy = sessionStorage.getItem('userId');
  elementIdEdit;
  @ViewChild('nameId') nameId: ElementRef = null;
  @ViewChild('codeId') codeId: ElementRef = null;
  @ViewChild('descriptionId') descriptionId: ElementRef = null;
  @ViewChild('displayOrderId') displayOrderId: ElementRef = null;
  @ViewChild('iconId') iconId: ElementRef = null;
  isGenericStateCheck: boolean = true;
  parentAssetTypeDropDownValue = null;
  assetCategoryDropDownValue = null;
  parentAssetTypeDropDownId = null;
  assetCategoryDropDownId = null;
  disableButtons = true;

  reviewName = null;
  reviewCode = null;
  reviewDescription = null;
  reviewIsGeneric = null;
  reviewParent = null;
  reviewCategory = null;
  reviewDisplayOrder = null;
  reviewIcon = null;
  heading: string;
  displayedColumns: string[] = ['id', 'name', 'code', 'parentAssetType', 'assetCategory', 'displayOrder', 'action'];
  saveObject: any;
  editObj: any;
  warningFlag: string;
  displayOrderCheck: any;
  assetTypeForm: FormGroup;
  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  assetCategoryName: string;
  parentAssetTypeView: any;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  reviewAndSaveDisable: boolean;
  resetValue: any;
  assetCategoryResetId: any;
  PreviewHeading: boolean;

  constructor(private AssetTypeService: AssetTypeService, private globalService: globalSharedService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.displayPage = 'assetTypeTable';
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter)
        || data.code.toLowerCase().includes(filter)
    };
    this.loadAssetTypeForm();
    this.showLoaderImage = true;
    this.getAssetTypeService();
    this.getAssetCategory();
    this.getParentAsset();
    this.displayError = false;
    this.heading = '';
    this.PreviewHeading = false;
  }

  loadAssetTypeForm() {
    this.assetTypeForm = this.formBuilder.group({
      parentAssetType: [null],
      assetCategory: [null, [Validators.required]]
    });
  }

  addAssetType() {
    this.disableButtons = true;
    this.displayPage = 'addAssetType';
    this.heading = 'Add';
    this.reviewName = null;
    this.reviewCode = null;
    this.reviewDescription = null;
    this.reviewIsGeneric = null;
    this.reviewDisplayOrder = null;
    this.reviewIcon = null;
    this.checkedValue = true;
  }

  parentDataField: object = { text: 'name', value: 'id' }
  public parentDropdown: object[] = [];

  categoryDataField: object = { text: 'name', value: 'id' }
  public categoryDropdown: object[] = [];

  isGenericState(event) {
    this.isGenericStateCheck = event.checked;
  }

  parentAssetTypeOnChange($event) {
    this.parentAssetTypeDropDownValue = $event.itemData.name;
    this.parentAssetTypeDropDownId = $event.itemData.id;
  }

  assetCategoryOnChange($event) {
    this.assetCategoryDropDownValue = $event.itemData.name;
    this.assetCategoryDropDownId = $event.itemData.id;
  }

  getAssetTypeService() {
    this.AssetTypeService.getAssetType().subscribe(res => {
      this.showLoaderImage = false;
      this.dataSource.data = res.sort((a, b) => b.id - a.id);
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
      this.dataSource.paginator = this.myPaginator;
    })
  }

  getParentAssetType(id) {
    for (let i = 0; i < this.parentDropdown.length; i++) {
      if (id == this.parentDropdown[i]['id']) {
        return this.parentDropdown[i]['name'];
      }
    }
  }

  getAssetCategory() {
    this.AssetTypeService.getAssetCategory().subscribe(res => {
      this.categoryDropdown = res;
    })
  }

  getParentAsset() {
    this.AssetTypeService.getAssetType().subscribe(res => {
      this.parentDropdown = res;
      this.parentAssetTypeView = res;
    })
  }

  cancel() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  reset() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  back() {
    this.PreviewHeading = false;
    if (this.heading === 'Edit') {
      this.heading = 'Edit';
    }
    else if (this.heading === 'Add'){
      this.heading = 'Add';
    }
    else {
      this.heading = '';
    }
    if (!(this.viewPage)) {
      this.ngOnInit();
    }
    else {
      this.displayPage = 'addAssetType';
    }
  }

  checkValidation() {
    if (this.displayOrderId.nativeElement.value <= 0) {
      this.displayOrderValidationError = true;
    }
    else {
      this.displayOrderValidationError = false;
    }
  }

  disableReviewAndSave() {
    if (this.displayOrderId.nativeElement.value > 0 || this.displayOrderId.nativeElement.value === '' ||
      this.displayOrderId.nativeElement.value == null || this.displayOrderId.nativeElement.value == undefined) {

      this.displayOrderValidationError = false;

      if (this.assetCategoryDropDownValue == null ||
        this.assetTypeForm.controls['assetCategory'].value == null ||
        this.assetCategoryDropDownValue == '' ||
        this.nameId.nativeElement.value === '' || this.codeId.nativeElement.value === '' ||
        this.validCodeErrorMessage || this.validNameErrorMessage) {
        this.reviewAndSaveDisable = true;
        setTimeout(() => { this.reviewAndSaveDisable = false; }, 2000);
      }
      else {
        this.reviewAndSaveDisable = false;
      }
    }
    else {
      this.displayOrderValidationError = true;
    }
  }

  disableCancelReset(state) {
    if (state === 'disable') {
      this.disableButtons = true;
    }
    else if (state === 'enable') {
      this.disableButtons = false;
    }
  }

  reviewAndSave() {
    this.PreviewHeading = true;
    this.viewPage = true;
    this.saveObject = {
      assetCategoryId: this.assetCategoryDropDownId,
      name: this.nameId.nativeElement.value,
      code: this.codeId.nativeElement.value,
      description: this.descriptionId.nativeElement.value,
      isGeneric: this.isGenericStateCheck,
      refAssetTypeId: this.parentAssetTypeDropDownId,
      displayOrder: parseInt(this.displayOrderId.nativeElement.value),
      icon: this.iconId.nativeElement.value,
      status: 'A',
      createdBy: this.createdBy,
    }
    this.editObj = {
      id: this.elementIdEdit,
      assetCategoryId: this.assetCategoryDropDownId,
      code: this.codeId.nativeElement.value,
      name: this.nameId.nativeElement.value,
      isGeneric: this.isGenericStateCheck,
      refAssetTypeId: this.parentAssetTypeDropDownId,
      description: this.descriptionId.nativeElement.value,
      icon: this.iconId.nativeElement.value,
      status: "A",
      displayOrder: parseInt(this.displayOrderId.nativeElement.value),
      updatedBy: this.updatedBy
    }
    this.reviewName = this.nameId.nativeElement.value;
    this.reviewCode = this.codeId.nativeElement.value;
    this.reviewDescription = this.descriptionId.nativeElement.value;
    if (!this.isGenericStateCheck) {
      this.reviewIsGeneric = "false";
    }
    if (this.isGenericStateCheck) {
      this.reviewIsGeneric = "true";
    }
    this.reviewParent = this.parentAssetTypeDropDownValue;
    this.reviewCategory = this.assetCategoryDropDownValue;
    this.reviewDisplayOrder = this.displayOrderId.nativeElement.value;
    this.reviewIcon = this.iconId.nativeElement.value;

    if (this.displayOrderId.nativeElement.value > 0 || this.displayOrderId.nativeElement.value === '' ||
      this.displayOrderId.nativeElement.value == null || this.displayOrderId.nativeElement.value == undefined) {

      this.displayOrderValidationError = false;

      if (this.assetCategoryDropDownValue == null ||
        this.assetTypeForm.controls['assetCategory'].value == null ||
        this.assetCategoryDropDownValue == '--select--' ||
        this.nameId.nativeElement.value === '' || this.codeId.nativeElement.value === '' ||
        this.validCodeErrorMessage || this.validNameErrorMessage) {
        this.displayError = true;
        setTimeout(() => { this.displayError = false; }, 3000);
      }
      else {
        this.displayPage = 'reviewAndSave';
        this.displayError = false;
      }
    }
    else {
      this.displayOrderValidationError = true;
    }
  }

  focusoutCode() {
    if (!(this.codeId.nativeElement.value.match(this.validCode)) || this.codeId.nativeElement.value === '') {
      this.validCodeErrorMessage = true;
    }
    else {
      this.validCodeErrorMessage = false;
    }
  }

  focusoutName() {
    if (!(this.nameId.nativeElement.value.match(this.validName)) || this.nameId.nativeElement.value === '') {
      this.validNameErrorMessage = true;
    }
    else {
      this.validNameErrorMessage = false;
    }
  }

  save() {
    this.PreviewHeading = false;
    if (this.heading == 'Add') {
      this.AssetTypeService.saveAssetType(JSON.stringify(this.saveObject)).subscribe(res => {
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.ngOnInit();
      },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }
    else if (this.heading == 'Edit') {
      this.AssetTypeService.editAssetType(JSON.stringify(this.editObj)).subscribe(res => {
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.ngOnInit();
      },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
    }

    this.nameId.nativeElement.value = null;
    this.codeId.nativeElement.value = null;
    this.descriptionId.nativeElement.value = null;
    this.displayOrderId.nativeElement.value = null;
    this.iconId.nativeElement.value = null;

    this.ngOnInit();
  }

  viewElement(element) {
    this.heading = 'View';
    this.PreviewHeading = false;
    this.displayPage = 'reviewAndSave';
    this.viewPage = false;
    this.reviewName = element.name;
    this.reviewCode = element.code;
    this.reviewDescription = element.description;
    if (!element.isGeneric) {
      this.reviewIsGeneric = "false";
    }
    if (element.isGeneric) {
      this.reviewIsGeneric = "true";
    }
    this.parentAssetTypeView.findIndex((obj) => {
      if (element.refAssetTypeId == obj.id) {
        this.reviewParent = obj.name;
      }
    });
    this.categoryDropdown.findIndex((obj) => {
      if (element.assetCategoryId == obj['id']) {
        this.reviewCategory = obj['name'];
      }
    });
    this.reviewDisplayOrder = element.displayOrder
    this.reviewIcon = element.icon
  }

  editElement(element) {
    this.displayPage = 'addAssetType';
    this.heading = 'Edit';
    if (element.code == undefined || element.code == null) {
      this.reviewCode = '-';
    }
    else {
      this.reviewCode = element.code;
    }
    if (element.description == undefined || element.description == null) {
      this.reviewDescription = '-';
    }
    else {
      this.reviewDescription = element.description;
    }
    if (element.displayOrder == undefined || element.displayOrder == null) {
      this.reviewDisplayOrder = '-';
    }
    else {
      this.reviewDisplayOrder = element.displayOrder;
    }
    if (element.icon == undefined || element.icon == null) {
      this.reviewIcon = '-';
    }
    else {
      this.reviewIcon = element.icon;
    }
    this.reviewName = element.name;
    this.checkedValue = element.isGeneric;

    this.resetValue = element.isGeneric;

    this.elementIdEdit = element.id;
    this.categoryDropdown.findIndex((obj) => {
      if (element.assetCategoryId == obj['id']) {
        this.assetCategoryName = obj['id'];
        this.assetCategoryDropDownId = obj['id'];
        this.assetCategoryDropDownValue = obj['name'];
        this.assetTypeForm.get('assetCategory').setValue(this.assetCategoryName);
      }
    });
    this.parentDropdown = this.removeObjectWithId(this.parentDropdown, element.id);

    this.assetCategoryResetId = this.assetTypeForm.controls['assetCategory'].value;

  }

  removeObjectWithId(parentDropdownArray, id) {
    const objWithIdIndex = parentDropdownArray.findIndex((obj) => obj.id === id);
    if (objWithIdIndex > -1) {
      parentDropdownArray.splice(objWithIdIndex, 1);
    }
    return parentDropdownArray;
  }

  deleteAssetType(element) {
    this.AssetTypeId = {
      id: element.id,
      assetCategoryId: element.assetCategoryId,
      code: element.code,
      name: element.name,
      isGeneric: true,
      description: "this.reviewDescription",
      status: 'A',
      displayOrder: element.displayOrder
    }
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Type !');
  }

  confirmDelete() {
    this.AssetTypeService.deleteAssetType(JSON.stringify(this.AssetTypeId)).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.ngOnInit();
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
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
    this.heading = '';
    this.parentAssetTypeDropDownValue = null;
    this.assetCategoryDropDownValue = null;
    this.ngOnInit();
  }

  formResetConfirm() {
    this.displayError = false;
    if (this.heading == "Edit") {
      this.nameId.nativeElement.value = this.reviewName;
      this.codeId.nativeElement.value = this.reviewCode;
      this.descriptionId.nativeElement.value = this.reviewDescription;
      this.displayOrderId.nativeElement.value = this.reviewDisplayOrder;
      this.iconId.nativeElement.value = this.reviewIcon;
      this.checkedValue = this.resetValue;
      this.assetTypeForm.controls['parentAssetType'].reset();
      this.parentAssetTypeDropDownId = null;
      this.reviewParent = null;

      this.assetTypeForm.get('assetCategory').setValue(this.assetCategoryResetId);

    }
    else {
      this.nameId.nativeElement.value = null;
      this.codeId.nativeElement.value = null;
      this.descriptionId.nativeElement.value = null;
      this.displayOrderId.nativeElement.value = null;
      this.iconId.nativeElement.value = null;
      this.assetTypeForm.reset();
    }
  }

  getAssetCategoryName(id: any) {
    for (let i = 0; i < this.categoryDropdown.length; i++) {
      if (id == this.categoryDropdown[i]['id']) {
        return this.categoryDropdown[i]['name'];
      }
    }
  }

  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }

  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

}
