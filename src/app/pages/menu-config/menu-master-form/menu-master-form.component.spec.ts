import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMasterFormComponent } from './menu-master-form.component';

describe('MenuMasterFormComponent', () => {
  let component: MenuMasterFormComponent;
  let fixture: ComponentFixture<MenuMasterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMasterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
