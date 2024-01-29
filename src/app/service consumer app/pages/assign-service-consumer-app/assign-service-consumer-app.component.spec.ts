import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignServiceConsumerAppComponent } from './assign-service-consumer-app.component';

describe('AssignServiceConsumerAppComponent', () => {
  let component: AssignServiceConsumerAppComponent;
  let fixture: ComponentFixture<AssignServiceConsumerAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignServiceConsumerAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignServiceConsumerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
