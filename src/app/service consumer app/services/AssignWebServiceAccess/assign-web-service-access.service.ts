import { Injectable } from '@angular/core';
import { WebServiceAccess } from '../../model/WebServiceAccess';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Service } from '../../../model/service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AssignWebServiceAccessService {

  apiurl = environment.baseUrl_MasterDataManagement;


  constructor(private http: HttpClient) { }

  getServicesByModuleId(moduleId:Number,serviceConsumerAppId:number){
    return this.http.get<Service>(this.apiurl + 'services/'+moduleId+"/"+serviceConsumerAppId);
  }
  assignServiceAccessToConsumerApp(webServiceAccess: WebServiceAccess[]): Observable<void> {
    return this.http.post<void>(`${this.apiurl + 'saveWebServiceAccess'}`, webServiceAccess, httpOptions);
  }
}
