import { TestBed } from '@angular/core/testing';

import { ServiceConsumerServicesService } from './service-consumer-services.service';

describe('ServiceConsumerServicesService', () => {
  let service: ServiceConsumerServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceConsumerServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
