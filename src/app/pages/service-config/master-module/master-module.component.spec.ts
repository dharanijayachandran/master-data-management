import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterModuleComponent } from './master-module.component';

describe('MasterModuleComponent', () => {
  let component: MasterModuleComponent;
  let fixture: ComponentFixture<MasterModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
