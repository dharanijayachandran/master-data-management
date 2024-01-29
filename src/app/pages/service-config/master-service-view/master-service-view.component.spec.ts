import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterServiceViewComponent } from './master-service-view.component';

describe('MasterServiceViewComponent', () => {
  let component: MasterServiceViewComponent;
  let fixture: ComponentFixture<MasterServiceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterServiceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterServiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
