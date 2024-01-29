import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterModuleViewComponent } from './master-module-view.component';

describe('MasterModuleViewComponent', () => {
  let component: MasterModuleViewComponent;
  let fixture: ComponentFixture<MasterModuleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterModuleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterModuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
