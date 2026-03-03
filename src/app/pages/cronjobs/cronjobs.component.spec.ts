import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronjobsComponent } from './cronjobs.component';

describe('CronjobsComponent', () => {
  let component: CronjobsComponent;
  let fixture: ComponentFixture<CronjobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronjobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
