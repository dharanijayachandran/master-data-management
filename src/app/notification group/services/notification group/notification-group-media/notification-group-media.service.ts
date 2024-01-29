import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { NotificationGroupMedia } from '../../../model/NotificationGroupMedia';
import { ResponseEntity } from 'src/app/access group/models/Response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class NotificationGroupMediaService {

  apiurl =environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) { }

  getNotificationGroupMedia(): Observable<NotificationGroupMedia[]> {
    return this.http.get<NotificationGroupMedia[]>(this.apiurl + 'notificationGroup/notificationGroupMedia');
  }

   // Create notification group media 
   createNotificationGroupMedia(notificationGroupMedia: NotificationGroupMedia): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity>(this.apiurl + 'notificationGroupMedia', notificationGroupMedia, httpOptions);
  }
}
