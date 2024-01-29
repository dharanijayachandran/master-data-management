import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AccessGroup } from '../models/AccessGroup';
import { environment } from 'src/environments/environment';
import { AccessGroupUser } from '../models/AccessGroupUser';
import { ResponseEntity } from '../models/Response';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccessGroupService {
  apiurl=environment.baseUrl_OrganizationManagement;
  constructor(private http:HttpClient) { }

  getAccessGroups(organizationId: number): Observable<AccessGroup[]> {
    return this.http.get<AccessGroup[]>(this.apiurl + 'organizations/'+organizationId+"/access-groups");
  }

 
  getAccessGroupUsers(organizationId: number,accessGroupId:number): Observable<AccessGroupUser[]> {
    return this.http.get<AccessGroupUser[]>(this.apiurl + 'organizations/'+organizationId+"/access-groups/" + accessGroupId);
  }

  // Create notification group
  createAccessGroup(accessGroup: AccessGroup): Observable<ResponseEntity> {
    let organizationId = sessionStorage.getItem("beId");
    return this.http.post<ResponseEntity>(this.apiurl + 'organizations/'+organizationId+"/access-groups", accessGroup, httpOptions);
  }

  // update access group
  updateAccessGroup(accessGroup: AccessGroup): Observable<ResponseEntity> {
    let organizationId = sessionStorage.getItem("beId");
    return this.http.put<ResponseEntity>(this.apiurl + 'organizations/'+organizationId+"/access-groups", accessGroup, httpOptions);
  }

  // delete access group
  deleteAccessGroup(accessGroupId: number, userId: number): Observable<ResponseEntity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    let organizationId = sessionStorage.getItem("beId");
    return this.http.delete<ResponseEntity>(`${this.apiurl + 'organizations/'+organizationId+"/access-groups/" + userId + '/' + accessGroupId}`, httpOptions);
  }
}
