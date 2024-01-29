import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-access-group-view',
  templateUrl: './access-group-view.component.html',
  styleUrls: ['./access-group-view.component.css']
})
export class AccessGroupViewComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {

  }

  // backButton navigate to form view
  backButton() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
