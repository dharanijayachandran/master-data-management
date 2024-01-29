import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConsumerFormComponent } from './service-consumer-form.component';

describe('ServiceConsumerFormComponent', () => {
  let component: ServiceConsumerFormComponent;
  let fixture: ComponentFixture<ServiceConsumerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConsumerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConsumerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
