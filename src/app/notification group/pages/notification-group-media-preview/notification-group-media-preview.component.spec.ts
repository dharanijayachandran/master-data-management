import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupMediaPreviewComponent } from './notification-group-media-preview.component';

describe('NotificationGroupMediaPreviewComponent', () => {
  let component: NotificationGroupMediaPreviewComponent;
  let fixture: ComponentFixture<NotificationGroupMediaPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGroupMediaPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGroupMediaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
