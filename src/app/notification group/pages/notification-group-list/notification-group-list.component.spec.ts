import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupListComponent } from './notification-group-list.component';

describe('NotificationGroupListComponent', () => {
  let component: NotificationGroupListComponent;
  let fixture: ComponentFixture<NotificationGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
