import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGroupViewComponent } from './access-group-view.component';

describe('AccessGroupViewComponent', () => {
  let component: AccessGroupViewComponent;
  let fixture: ComponentFixture<AccessGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
