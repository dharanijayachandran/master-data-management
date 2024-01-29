import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupPreviewComponent } from './notification-group-preview.component';

describe('NotificationGroupPreviewComponent', () => {
  let component: NotificationGroupPreviewComponent;
  let fixture: ComponentFixture<NotificationGroupPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
