import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterMenuViewComponent } from './menu-master-view.component';

describe('MenuViewComponent', () => {
  let component: MasterMenuViewComponent;
  let fixture: ComponentFixture<MasterMenuViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterMenuViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
