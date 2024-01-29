import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterServiceComponent } from './master-service.component';

describe('MasterServiceComponent', () => {
  let component: MasterServiceComponent;
  let fixture: ComponentFixture<MasterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
