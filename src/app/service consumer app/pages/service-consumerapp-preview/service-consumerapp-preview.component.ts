import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { ServiceConsumerApp } from '../../model/serviceCounsumerApp';


@Component({
  selector: 'app-service-consumerapp-preview',
  templateUrl: './service-consumerapp-preview.component.html',
  styleUrls: ['./service-consumerapp-preview.component.css']
})
export class ServiceConsumerappPreviewComponent implements OnInit {

  serviceConsumerApp: ServiceConsumerApp;

  constructor(private globalService: globalSharedService, private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    // Getting ServiceConsumerapp id to preview and getting perticular ServiceConsumerapp detail
    let id = this.globalService.selectedId;
    this.serviceConsumerApp = this.globalService.listOfRow;
  }

  backButton(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

}
