import { TestBed } from '@angular/core/testing';

import { NotificationGroupService } from './notification-group.service';

describe('NotificationGroupService', () => {
  let service: NotificationGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
