import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmastermoduleComponent } from './addmastermodule.component';

describe('AddmastermoduleComponent', () => {
  let component: AddmastermoduleComponent;
  let fixture: ComponentFixture<AddmastermoduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmastermoduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmastermoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
