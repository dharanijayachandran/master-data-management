import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupViewComponent } from './notification-group-view.component';

describe('NotificationGroupViewComponent', () => {
  let component: NotificationGroupViewComponent;
  let fixture: ComponentFixture<NotificationGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
