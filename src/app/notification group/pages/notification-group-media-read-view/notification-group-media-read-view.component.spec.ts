import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupMediaReadViewComponent } from './notification-group-media-read-view.component';

describe('NotificationGroupMediaReadViewComponent', () => {
  let component: NotificationGroupMediaReadViewComponent;
  let fixture: ComponentFixture<NotificationGroupMediaReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupMediaReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupMediaReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
