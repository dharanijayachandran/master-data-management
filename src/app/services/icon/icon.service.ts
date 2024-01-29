import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Icon } from '../../model/icon';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  apiurl = environment.baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) { }

  getIconsList(): Observable<Icon[]> {
    return this.http.get<Icon[]>(this.apiurl +'icons');
  }
}
