import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { NotificationGroup } from '../../../model/NotificationGroup';
import { NotificationMedia } from '../../../model/NotificationMedia';
import { NotificationGroupUser } from '../../../model/NotificationGroupUser';
import { ResponseEntity } from 'src/app/access group/models/Response';
import { TimeZone } from 'global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class NotificationGroupService {

  apiurl =environment.baseUrl_OrganizationManagement;
  masterApiurl=environment.baseUrl_MasterDataManagement;


  constructor(private http: HttpClient) { }

  getNotificationGroups(organizationId: number): Observable<NotificationGroup[]> {
    return this.http.get<NotificationGroup[]>(this.apiurl + 'notificationGroup/' + organizationId);
  }

  getNotificationMedia(): Observable<NotificationMedia[]> {
    return this.http.get<NotificationMedia[]>(this.apiurl + 'notificationGroup/notificationMedia');
  }

  getNotificationGroupUsers(organizationId: number): Observable<NotificationGroupUser[]> {
    return this.http.get<NotificationGroupUser[]>(this.apiurl + 'notificationGroup/notificationGroupUsers/' + organizationId);
  }

  // Create notification group
  createNotificationGroup(notificationGroup: NotificationGroup): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity>(this.apiurl + 'notificationGroup', notificationGroup, httpOptions);
  }

  // update notification group
  updateNotificationGroup(notificationGroup: NotificationGroup): Observable<ResponseEntity> {
    return this.http.put<ResponseEntity>(this.apiurl + 'notificationGroup', notificationGroup, httpOptions);
  }

  // delete notification group
  deleteNotificationGroup(notificationGroupId: number, userId: number): Observable<ResponseEntity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<ResponseEntity>(`${this.apiurl + 'notificationGroup/' + userId + '/' + notificationGroupId}`, httpOptions);
  }

  getTimeZoneList(): Observable<TimeZone[]> {
    return this.http.get<TimeZone[]>(this.masterApiurl+'timezone');
  }
}
