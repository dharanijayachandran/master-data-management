import { TestBed } from '@angular/core/testing';

import { NotificationGroupMediaService } from './notification-group-media.service';

describe('NotificationGroupMediaService', () => {
  let service: NotificationGroupMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationGroupMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
