import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServiceCounsumerAppViewComponent } from './web-service-counsumer-app-view.component';

describe('WebServiceCounsumerAppViewComponent', () => {
  let component: WebServiceCounsumerAppViewComponent;
  let fixture: ComponentFixture<WebServiceCounsumerAppViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebServiceCounsumerAppViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebServiceCounsumerAppViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
