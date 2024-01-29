import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupReadViewComponent } from './notification-group-read-view.component';

describe('NotificationGroupReadViewComponent', () => {
  let component: NotificationGroupReadViewComponent;
  let fixture: ComponentFixture<NotificationGroupReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
