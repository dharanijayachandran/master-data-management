import { TestBed } from '@angular/core/testing';

import { WebServiceConsumerService } from './web-service-consumer.service';

describe('WebServiceConsumerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebServiceConsumerService = TestBed.get(WebServiceConsumerService);
    expect(service).toBeTruthy();
  });
});
