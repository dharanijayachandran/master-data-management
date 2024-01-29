import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { Service } from '../../../model/service';

@Component({
  selector: 'app-master-service-view',
  templateUrl: './master-service-view.component.html',
  styleUrls: ['./master-service-view.component.css']
})
export class MasterServiceViewComponent implements OnInit {

  masterService: Service;
  id: any;
  data: any;
  dataId: any;

  constructor(private globalService: globalSharedService, private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    // Getting ServiceConsumerapp id to preview and getting perticular ServiceConsumerapp detail
     this.id = this.globalService.selectedId;
    this.masterService = this.globalService.listOfRow;
    this.data = this.globalService.listOfModulesforServices;
    this.dataId = this.globalService.listOfModulesforServices.id;
  }

  backButton()
  {
        this.router.navigate(['../'], {relativeTo:this.route});
        this.globalService.GettingString('mngService');
        this.globalService.GettingId(this.dataId);
        this.globalService.setOrganizationDetail('', this.data);
  }

}
