import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { globalSharedService } from 'src/app/shared/globalSharedService';
import { Module } from '../../../model/module';

@Component({
  selector: 'app-master-module-view',
  templateUrl: './master-module-view.component.html',
  styleUrls: ['./master-module-view.component.css']
})
export class MasterModuleViewComponent implements OnInit {

 public module: Module;

  constructor(private globalService: globalSharedService, private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    // Getting ServiceConsumerapp id to preview and getting perticular ServiceConsumerapp detail
    let id = this.globalService.selectedId;
    this.module = this.globalService.listOfRow;
  }
  ngAfterViewInit() { }

  backButton()
  {
    this.router.navigate(['../'],{relativeTo:this.route});
  }

}
