import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { assetStandardDropdown } from 'src/app/model/assetStandardDropdown';
import { assetStandardEntity } from 'src/app/model/assetStandardEntity';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AssetStandardTagService {

  url = environment.baseUrl_AssetManagement;
  constructor(private http: HttpClient) { }

  getAssetStandardTag(organizationId: number): Observable<assetStandardEntity[]> {
    return this.http.get<assetStandardEntity[]>(this.url + '/' + organizationId + '/asset-standard-tags');
  }

  saveAssetStandardTags(saveAssetTags:any){
    let organizationId = sessionStorage.getItem('beId');
    return this.http.post<any>(this.url + 'organizations/' + organizationId + '/asset-standard-tags', saveAssetTags);
  }

  getDropdownFields() {
    return this.http.get<assetStandardDropdown[]>(this.url + 'assetStandardTags');
  }

}
