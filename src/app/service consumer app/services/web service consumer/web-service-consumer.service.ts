import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ServiceConsumerApp } from '../../model/serviceCounsumerApp';
import { Token } from '../../model/token';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class WebServiceConsumerService {

  apiurl = environment.baseUrl_MasterDataManagement;


  constructor(private http: HttpClient) { }

  getToken(): Observable<Token> {
    return this.http.get<Token>(this.apiurl + 'getToken');
  }

  getServiceConsumerApps(): Observable<ServiceConsumerApp[]> {
    return this.http.get<ServiceConsumerApp[]>(this.apiurl + 'serviceConsumerApps');
  }

  getWebServiceConsumerAppById(id: number): Observable<ServiceConsumerApp> {

    return this.http.get<ServiceConsumerApp>(this.apiurl + 'serviceConsumerAppsById/' + id);
  }

  addServiceConsumerApp(serviceConsumerApp: ServiceConsumerApp): Observable<void> {
    return this.http.post<void>(`${this.apiurl + 'saveServiceConsumerApp'}`, serviceConsumerApp, httpOptions);
  }
  updateServiceConsumerApp(serviceConsumerApp: ServiceConsumerApp): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'updateServiceConsumerApp'}`, serviceConsumerApp, httpOptions);
  }
  deleteServiceConsumerApp(userId:number,id: number): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl + 'deleteServiceConsumer/' +userId+"/"+id}`, httpOptions);
  }
}
