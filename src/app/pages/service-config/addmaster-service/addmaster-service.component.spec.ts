import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmasterServiceComponent } from './addmaster-service.component';

describe('AddmasterServiceComponent', () => {
  let component: AddmasterServiceComponent;
  let fixture: ComponentFixture<AddmasterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmasterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmasterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
