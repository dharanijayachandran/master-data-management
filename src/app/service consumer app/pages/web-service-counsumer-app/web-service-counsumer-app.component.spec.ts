import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServiceCounsumerAppComponent } from './web-service-counsumer-app.component';

describe('WebServiceCounsumerAppComponent', () => {
  let component: WebServiceCounsumerAppComponent;
  let fixture: ComponentFixture<WebServiceCounsumerAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebServiceCounsumerAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebServiceCounsumerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
