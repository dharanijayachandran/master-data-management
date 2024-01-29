import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupMediaFormComponent } from './notification-group-media-form.component';

describe('NotificationGroupMediaFormComponent', () => {
  let component: NotificationGroupMediaFormComponent;
  let fixture: ComponentFixture<NotificationGroupMediaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupMediaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupMediaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
