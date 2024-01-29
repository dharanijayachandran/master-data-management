import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class globalService {
  editPage: boolean;
  savePage: boolean;
  viewIcon: boolean;
  updateElement: any;
  ServiceConsumerElement: any;
  serviceConsumerApplicationElement: any;
}
