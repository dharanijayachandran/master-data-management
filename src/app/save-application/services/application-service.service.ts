import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationServiceService {
  apiURL = environment.baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) { }

  getApplications() {
    return this.http.get<any>( this.apiURL + "applications");
  }

  saveApplication(saveApplication:any) {
    return this.http.post<any>(this.apiURL + "applications", saveApplication);
  }

  editApplication(editApplication:any) {
    return this.http.put<any>( this.apiURL + "applications", editApplication);
  }

  deleteApplication(editApplication:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: editApplication
    };
    return this.http.delete<any>(this.apiURL + "applications", httpOptions);
  }

}
