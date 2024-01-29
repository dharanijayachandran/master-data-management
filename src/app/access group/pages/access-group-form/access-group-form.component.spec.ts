import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGroupFormComponent } from './access-group-form.component';

describe('AccessGroupFormComponent', () => {
  let component: AccessGroupFormComponent;
  let fixture: ComponentFixture<AccessGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
