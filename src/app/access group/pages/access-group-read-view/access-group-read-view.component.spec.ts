import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGroupReadViewComponent } from './access-group-read-view.component';

describe('AccessGroupReadViewComponent', () => {
  let component: AccessGroupReadViewComponent;
  let fixture: ComponentFixture<AccessGroupReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessGroupReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessGroupReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
