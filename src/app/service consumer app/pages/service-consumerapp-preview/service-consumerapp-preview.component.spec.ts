import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConsumerappPreviewComponent } from './service-consumerapp-preview.component';

describe('ServiceConsumerappPreviewComponent', () => {
  let component: ServiceConsumerappPreviewComponent;
  let fixture: ComponentFixture<ServiceConsumerappPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConsumerappPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConsumerappPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
