import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebServiceCounsumerAppComponent } from './add-web-service-counsumer-app.component';

describe('AddWebServiceCounsumerAppComponent', () => {
  let component: AddWebServiceCounsumerAppComponent;
  let fixture: ComponentFixture<AddWebServiceCounsumerAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWebServiceCounsumerAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWebServiceCounsumerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
