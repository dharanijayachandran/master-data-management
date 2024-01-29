import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupFormComponent } from './notification-group-form.component';

describe('NotificationGroupFormComponent', () => {
  let component: NotificationGroupFormComponent;
  let fixture: ComponentFixture<NotificationGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
