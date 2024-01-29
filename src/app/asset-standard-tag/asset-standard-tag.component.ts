import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { globalSharedService, ScrollbarDirective, UIModalNotificationPage } from 'global';
import { assetStandardEntity } from '../model/assetStandardEntity';
import { AssetStandardTagService } from '../notification group/services/asset standard tag/asset-standard-tag.service';
import { MatTablePaginatorComponent } from '../shared/components/mat-table-paginator/mat-table-paginator.component';

@Component({
  selector: 'app-asset-standard-tag',
  templateUrl: './asset-standard-tag.component.html',
  styleUrls: ['./asset-standard-tag.component.css']
})
export class AssetStandardTagComponent implements OnInit {
  dataSource: any;
  showLoaderImage = true;
  noRecordFound: boolean = false;
  displayedColumns: string[] = ['sno', 'name', 'description', 'code', 'standardTagId', 'action'];
  assetStandardTagsForm: FormGroup;
  displayPage: string;
  fieldsValues: any;
  iterateFormValues: assetStandardEntity[];
  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  organizationId = sessionStorage.getItem('beId');
  @ViewChild('nameId') nameId: ElementRef;
  @ViewChild('codeId') codeId: ElementRef;
  validCode = /^[a-zA-Z0-9\-]+$/;
  validCodeErrorMessage: boolean;
  validName = /^[\S]+.*[\S]$/;
  validNameErrorMessage: boolean;
  reviewAndSaveDisabled: any;
  codeValueCheck;
  nameValueCheck;
  nameAndCodeValidation: boolean = false;
  newRowAdded: boolean;
  descriptionEdit: boolean;

  dataField: object = { text: 'name', value: 'id' }
  public assetStandardTagDropdown: any[] = [];

  selectObject = {
    id: null,
    name: '--select--'
  }

  constructor(public formBuilder: FormBuilder, private globalService: globalSharedService, private AssetStandardTagServiceControllers: AssetStandardTagService) { }

  assetStandardEntityList: assetStandardEntity[] = [];
  assetStandardObject: assetStandardEntity;
  index: number;
  assetTagRemovedList = [];
  warningFlag: string;
  assetStandardEntityListDelete;
  userId;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  text = '';
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  @ViewChild(UIModalNotificationPage) modelNotification;

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.displayPage = "assetStandardTagsPage";
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) ||
        data.code.toString().toLowerCase().includes(filter)
    };
    this.getDropdownFields();
    this.loadAssetTagGroupForm();
    this.showLoaderImage = true;
    this.getAssetStandardTagData();
    this.reviewAndSaveDisabled = true;
  }

  getDropdownFields() {
    this.AssetStandardTagServiceControllers.getDropdownFields().subscribe(res => {
      this.assetStandardTagDropdown = res;
      this.assetStandardTagDropdown.unshift(this.selectObject);
    })
  }

  patchFormArrayData(assetStandardEntity): FormArray {
    const formArray = new FormArray([]);
    if (assetStandardEntity !== null && assetStandardEntity.length !== 0) {
      assetStandardEntity.forEach(element => {
        if (element !== null) {
          formArray.push(this.formBuilder.group({
            id: element.id,
            organizationId: this.organizationId,
            name: [element.name],
            description: [element.description],
            code: element.code,
            standardTagId: element.standardTagId,
            status: 'A',
            updatedBy: this.userId
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            organizationId: this.organizationId,
            name: [''],
            description: [''],
            code: [''],
            standardTagId: [''],
            status: ['A'],
            updatedBy: [this.userId]
          }))
        }
      })
    }
    return formArray
  }

  loadAssetTagGroupForm() {
    this.assetStandardTagsForm = this.formBuilder.group({
      assetStandardEntityList: this.formBuilder.array([])
    })
  }

  addRow() {
    let control = <FormArray>this.assetStandardTagsForm.controls['assetStandardEntity'];
    let data = this.dataSource.data;
    if (data != null && data.length !== 0) {
      control.push(this.createRow());
      data.push(control);
      this.dataSource.data = data;
    } else {
      data = [];
      control.push(this.createRow());
      data.push(control);
      this.dataSource.data = data;
    }
    this.newRowAdded = true;
    this.reviewAndSaveDisabled = true;
  }

  createRow(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      organizationId: this.organizationId,
      name: [""],
      description: [""],
      code: [""],
      standardTagId: [null],
      status: ["A"],
      createdBy: this.userId,
    });
  }

  reviewAndSave() {
    this.fieldsValues = this.assetStandardTagsForm.value;
    this.iterateFormValues = JSON.parse(JSON.stringify(this.fieldsValues['assetStandardEntity']));
    for (let i = 0; i < this.iterateFormValues.length; i++) {
      if ((this.iterateFormValues[i].code === '') || (this.iterateFormValues[i].name === '') ||
        this.validCodeErrorMessage || this.validNameErrorMessage) {
        this.nameAndCodeValidation = true;
        this.displayPage = "assetStandardTagsPage";
      }
      else {
        this.nameAndCodeValidation = false;
        this.displayPage = "saveTags";
      }
    }
  }

  reviewAndSaveDisable() {
    if (this.validCodeErrorMessage || this.validNameErrorMessage) {
      this.reviewAndSaveDisabled = true;
      setTimeout(() => { this.reviewAndSaveDisabled = false; }, 2000);
    }
    else {
      this.reviewAndSaveDisabled = false;
    }
  }

  back() {
    this.displayPage = "assetStandardTagsPage";
    this.iterateFormValues = [];
    this.ngOnInit();
    this.validCodeErrorMessage == false;
    this.validNameErrorMessage == false;
    this.nameAndCodeValidation == false;
  }

  reset() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  cancel() {
    this.warningFlag = "cancel";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  deleteAssetTag(elementId, index) {
    let deleteListById;
    this.assetStandardEntityListDelete.forEach(data => {
      if (data.id == elementId) {
        deleteListById = data;
      }
    })
    this.assetStandardObject = null;
    this.index = null;
    if (this.assetStandardObject == null && this.assetStandardObject == undefined) {
      this.assetStandardObject = deleteListById;
      this.index = index;
    }
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Standard Tag !');
  }

  confirmDelete() {
    const control = <FormArray>this.assetStandardTagsForm.controls['assetStandardEntity'];
    control.removeAt(this.index)
    if (this.assetStandardObject != undefined && this.assetStandardObject != null) {
      if (this.assetStandardObject.id != null) {
        this.assetStandardEntityListDelete.forEach(assetStandard => {
          if (this.assetStandardObject.id == assetStandard.id) {
            assetStandard.status = 'D';
            let obj = this.formatassetStandardEntityObj(assetStandard);
            this.assetTagRemovedList.push(obj);
          }
        })
      }
    }
    let temp = this.dataSource.data
    temp.splice(this.index, 1);
    this.dataSource.data = [];
    this.dataSource.data = temp;
    this.reviewAndSaveDisabled = false;
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
    this.ngOnInit();
    this.nameAndCodeValidation = false;
    this.validCodeErrorMessage = false;
    this.validNameErrorMessage = false;
  }

  formResetConfirm() {
    this.ngOnInit();
    this.nameAndCodeValidation = false;
    this.validCodeErrorMessage = false;
    this.validNameErrorMessage = false;
  }

  formatassetStandardEntityObj(AssteTagobj) {
    let Obj: assetStandardEntity = new assetStandardEntity();
    Obj.id = AssteTagobj.id,
      Obj.name = AssteTagobj.name,
      Obj.description = AssteTagobj.description,
      Obj.code = AssteTagobj.code,
      Obj.standardTagId = AssteTagobj.standardTagId,
      Obj.organizationId = AssteTagobj.organizationId,
      Obj.status = AssteTagobj.status,
      Obj.createdBy = AssteTagobj.createdBy
    return Obj;
  }

  getAssetStandardTagData() {
    let organizationId = sessionStorage.getItem("beId");
    this.AssetStandardTagServiceControllers.getAssetStandardTag(Number(organizationId)).subscribe(res => {
      this.showLoaderImage = false;
      this.assetStandardEntityList = res.sort((a, b) => b.id - a.id);
      let assetStandardEntityList: assetStandardEntity[] = [];
      for (let i = 0; i < this.assetStandardEntityList.length; i++) {
        assetStandardEntityList.push(this.assetStandardEntityList[i]);
      }
      this.dataSource.data = assetStandardEntityList;
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
      this.dataSource.paginator = this.myPaginator;
      this.assetStandardEntityListDelete = assetStandardEntityList;
      this.assetStandardTagsForm.setControl('assetStandardEntity', this.patchFormArrayData(assetStandardEntityList));
    });
  }

  saveEntity() {
    if (this.assetTagRemovedList.length != 0 && this.assetTagRemovedList != undefined) {
      for (let i = 0; i < this.assetTagRemovedList.length; i++) {
        this.iterateFormValues.push(this.assetTagRemovedList[i]);
      }
    }
    this.AssetStandardTagServiceControllers.saveAssetStandardTags(this.iterateFormValues).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.ngOnInit();
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  getAssetStandardTagName(elementId): string {
    for (let i = 0; i < this.assetStandardTagDropdown.length && elementId != null; i++) {
      if (this.assetStandardTagDropdown[i].id == elementId) {
        return this.assetStandardTagDropdown[i].name;
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

  inputCode(code) {
    if (!(code.target.value).match(this.validCode) || code.target.value > 0) {
      this.validCodeErrorMessage = true;
    }
    else {
      this.validCodeErrorMessage = false;
      this.codeValueCheck = true;
    }

    if (this.newRowAdded) {
      if (this.codeValueCheck && this.nameValueCheck) {
        this.reviewAndSaveDisabled = false;
      }
      else {
        this.reviewAndSaveDisabled = true;
      }
    }
    else {
      this.reviewAndSaveDisabled = false;
    }
  }

  inputName(name) {
    if (!(name.target.value).match(this.validName)) {
      this.validNameErrorMessage = true;
    }
    else {
      this.validNameErrorMessage = false;
      this.nameValueCheck = true;
    }

    if (this.newRowAdded) {
      if (this.codeValueCheck && this.nameValueCheck) {
        this.reviewAndSaveDisabled = false;
      }
      else {
        this.reviewAndSaveDisabled = true;
      }
    }
    else {
      this.reviewAndSaveDisabled = false;
    }
  }

  inputDescription() {
    this.reviewAndSaveDisabled = false;
  }

  assetStandardTagOnChange($event) {
    this.reviewAndSaveDisabled = false;
  }

}
