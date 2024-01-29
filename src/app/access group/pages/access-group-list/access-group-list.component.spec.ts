import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGroupListComponent } from './access-group-list.component';

describe('AccessGroupListComponent', () => {
  let component: AccessGroupListComponent;
  let fixture: ComponentFixture<AccessGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
