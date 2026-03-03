import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionLogsComponent } from './execution-logs.component';

describe('ExecutionLogsComponent', () => {
  let component: ExecutionLogsComponent;
  let fixture: ComponentFixture<ExecutionLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
