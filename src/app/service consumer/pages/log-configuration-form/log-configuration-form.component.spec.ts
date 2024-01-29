import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogConfigurationFormComponent } from './log-configuration-form.component';

describe('LogConfigurationFormComponent', () => {
  let component: LogConfigurationFormComponent;
  let fixture: ComponentFixture<LogConfigurationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogConfigurationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
