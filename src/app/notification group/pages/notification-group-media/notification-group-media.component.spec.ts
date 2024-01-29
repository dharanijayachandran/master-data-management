import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupMediaComponent } from './notification-group-media.component';

describe('NotificationGroupMediaComponent', () => {
  let component: NotificationGroupMediaComponent;
  let fixture: ComponentFixture<NotificationGroupMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
