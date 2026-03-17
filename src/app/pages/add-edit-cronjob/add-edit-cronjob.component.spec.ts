import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCronjobComponent } from './add-edit-cronjob.component';

describe('AddEditCronjobComponent', () => {
  let component: AddEditCronjobComponent;
  let fixture: ComponentFixture<AddEditCronjobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCronjobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCronjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
