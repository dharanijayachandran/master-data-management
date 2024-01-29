import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Service } from '../../model/service';
import { AccessType } from '../../model/accessType';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {

  apiurl = environment.baseUrl_MasterDataManagement;


  constructor(private http: HttpClient) { }

  addService(service:Service){
    return this.http.post<void>(`${this.apiurl + 'addService'}`, service, httpOptions);
  }

  updateService(service:Service){
    return this.http.put<void>(`${this.apiurl + 'updateService'}`, service, httpOptions);
  }

  getServiceList(){
    return this.http.get<Service[]>(this.apiurl + 'services');
  }

  getServiceByServiceId(id:Number){
    return this.http.get<Service>(this.apiurl + 'service/'+id);
  }

  deleteService(id:Number,userId:Number){
    return this.http.delete<void>(`${this.apiurl+'deleteService/'+userId+'/'+id}`,httpOptions); 
  }

  getServiceListByModuleId(moduleId:Number){
    return this.http.get<Service[]>(this.apiurl + 'servicesList/'+moduleId);
  }

  getAccessTypes(){
    return this.http.get<AccessType[]>(this.apiurl + 'access-types');
  }

}
