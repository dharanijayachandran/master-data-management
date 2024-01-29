import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetTypeService {

  getUrl = environment.baseUrl_AssetManagement;
  saveUrl = environment.baseUrl_OrganizationManagement
  organizationId = sessionStorage.getItem('beId');

  constructor(private http: HttpClient) { }

  getAssetType() {
    return this.http.get<any>(this.getUrl + 'organizations/' + this.organizationId + '/asset-types');
  }

  saveAssetType(saveAssetType:any) {
    return this.http.post<any>(this.saveUrl + 'organizations/' + this.organizationId + '/asset-types', saveAssetType);
  }

  getAssetCategory(){
    return this.http.get<any>(this.getUrl + '/assetCategory');
  }

  editAssetType(saveAssetType:any) {
    return this.http.put<any>(this.saveUrl + 'organizations/' + this.organizationId + '/asset-types', saveAssetType);
  }

  deleteAssetType(elementId){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: elementId
    };
    return this.http.delete<any>(this.saveUrl + "organizations/" + this.organizationId + "/asset-types", httpOptions);
  }

}

