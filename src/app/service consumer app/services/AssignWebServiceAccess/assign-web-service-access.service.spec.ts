import { TestBed } from '@angular/core/testing';

import { AssignWebServiceAccessService } from './assign-web-service-access.service';

describe('AssignWebServiceAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssignWebServiceAccessService = TestBed.get(AssignWebServiceAccessService);
    expect(service).toBeTruthy();
  });
});
