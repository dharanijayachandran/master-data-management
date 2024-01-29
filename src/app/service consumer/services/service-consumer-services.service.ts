import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ServiceConsumer } from 'src/app/service consumer/model/serviceConsumer';
import { Applications } from 'src/app/service consumer/model/application';
import { LogConfiguration } from 'src/app/service consumer/model/logConfiguration';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ServiceConsumerServicesService {

  apiurl = environment.baseUrl_MasterDataManagement;
  constructor(private http: HttpClient) { }
  // ====== service consumer
  
  getServiceConsumer(): Observable<ServiceConsumer[]> {
    return this.http.get<ServiceConsumer[]>(this.apiurl + 'service-consumer');
  }
  deleteServiceConsumer(elementId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: elementId
    };
    return this.http.delete<void>(`${this.apiurl + 'service-consumer'}`, httpOptions);
  }
  saveServiceConsumer(serviceConsumer: ServiceConsumer): Observable<void> {
    return this.http.post<void>(`${this.apiurl + 'service-consumer'}`, serviceConsumer, httpOptions);
  }
  editServiceConsumer(serviceConsumer: ServiceConsumer): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'service-consumer'}`, serviceConsumer, httpOptions);
  }
  
  // ====== Application

  getApplicationCategoryDropdown(): Observable<Applications[]>{
    return this.http.get<Applications[]>(this.apiurl + 'app-categories');
  }
  getApplication(elementId): Observable<Applications[]> {
    return this.http.get<Applications[]>(this.apiurl + 'service-consumer/' + elementId + "/application");
  }
  deleteApplication(elementId, serviceConsumerId, applicationId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: elementId
    };
    return this.http.delete<void>(`${this.apiurl + 'service-consumer/' + serviceConsumerId + "/application/" + applicationId}`, httpOptions);
  }
  saveApplication(application: Applications, serviceConsumerId): Observable<void> {
    return this.http.post<void>(`${this.apiurl + 'service-consumer/' + serviceConsumerId + "/application"}`, application, httpOptions);
  }
  editApplication(application: Applications, serviceConsumerId, applicationId): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'service-consumer/' + serviceConsumerId + "/application/" + applicationId}`, application, httpOptions);
  }

  // ====== log configuration
  
  getLog(serviceConsumerId, serviceConsumerApplicationElementId): Observable<LogConfiguration[]> {
    
    return this.http.get<LogConfiguration[]>(this.apiurl + 'consumer/' + serviceConsumerId + '/application/' + serviceConsumerApplicationElementId + '/log-configuration');
  }
  getLogLevel() {
    return this.http.get(this.apiurl + 'logLevels');
  }
  getLogOutputDestination() {
    return this.http.get(this.apiurl + 'log-output-destination');
  }
  deleteLog(elementId, serviceConsumerId, applicationId, logId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: elementId
    };
    return this.http.delete<void>(`${this.apiurl + 'consumer/' + serviceConsumerId + '/application/' + applicationId + '/log-configuration/' + logId}`, httpOptions);
  }
  saveLog(log: LogConfiguration, serviceConsumerId, applicationId): Observable<void> {
    return this.http.post<void>(`${this.apiurl + 'consumer/' + serviceConsumerId + '/application/' + applicationId + '/log-configuration'}`, log, httpOptions);
  }
  editLog(log: LogConfiguration, serviceConsumerId, applicationId, configId): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'consumer/' + serviceConsumerId + '/application/' + applicationId + '/log-configuration/' + configId}`, log, httpOptions);
  }

  // ======
}
