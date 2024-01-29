import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Application } from 'src/app/model/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  apiurl = environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) { }
  
  getApplicationList(isSystemAdmin): Observable<Application[]> {
    let organizationId = sessionStorage.getItem('beId');
    return this.http.get<Application[]>(this.apiurl + 'organizations/' + organizationId + '/applications?isSystemAdmin='+ isSystemAdmin);
  }
}
