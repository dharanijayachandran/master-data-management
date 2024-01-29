import { Injectable } from '@angular/core';
import { Module } from '../../model/module';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  apiurl = environment.baseUrl_MasterDataManagement;


  constructor(private http: HttpClient) { }

  addModule(module:Module){
    return this.http.post<void>(`${this.apiurl + 'addModule'}`, module, httpOptions);
  }

  updateModule(module:Module){
    return this.http.put<void>(`${this.apiurl + 'updateModule'}`, module, httpOptions);
  }

  getModuleList(){
    return this.http.get<Module[]>(this.apiurl + 'modules');
  }

  getModuleByModuleId(id:Number){
    return this.http.get<Module>(this.apiurl + 'module/'+id);
  }

  deleteModule(id:Number,userId:Number){
    return this.http.delete<void>(`${this.apiurl+'deleteModule/'+userId+'/'+id}`,httpOptions); 
  }
}
