import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFieldBaseComponent } from '../../components/new/input-field-base/input-field-base.component';
import { SelectComponent } from '../../components/inputs/select/select.component';
import { ButtonComponent } from '../../components/new/button/button.component';
import { CronCreateRequest } from '../../../models/data.models';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { CronService } from '../../../services/cron.service';
import { CronStateService } from '../../../services/cron-state.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-edit-cronjob',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldBaseComponent, SelectComponent, ButtonComponent, EditorComponent],
  templateUrl: './add-edit-cronjob.component.html',
  styleUrl: './add-edit-cronjob.component.css'
})
export class AddEditCronjobComponent {
  cronForm: FormGroup;
  isSubmitting = false;
  cronService = inject(CronService);
  cronState = inject(CronStateService);
  router = inject(Router);

  editorOptions = {theme: 'vs-dark', language: 'json', automaticLayout: true, minimap: {enabled: false}, scrollBeyondLastLine: false, formatOnPaste: true, formatOnType: true};

  httpMethodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  scheduleTypeOptions = [
    {label: 'Cron Expression', value: 'cron'},
    {label: 'Interval', value: 'interval'},
    {label: 'One-Time', value: 'one-time'},
  ];
  retryStrategies = ['Fixed Delay', 'Exponential Backoff'];
  notificationOptions = ['Never', 'On Failure', 'On Success', 'Always'];

  headerKeyOptions = [
    'Authorization',
    'Content-Type',
    'Accept',
    'User-Agent',
    'X-API-Key'
  ];
  
  intervalUnitOptions = [
    {label: 'seconds', value: 's'},
    {label: 'minutes', value: 'm'},
    {label: 'hours', value: 'h'},
    {label: 'days', value: 'd'}
  ];

  constructor(private fb: FormBuilder) {
    this.cronForm = this.fb.group({
      cronName: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      endpointUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      httpMethod: ['GET', Validators.required],
      timeoutSeconds: [30, [Validators.min(1), Validators.max(300)]],
      headers: this.fb.array([]),
      payload: ['{\n  \n}'],
      scheduleType: ['cron', Validators.required],
      scheduleExpression: [''],
      intervalValue: [15, Validators.min(1)],
      intervalUnit: ['s'],
      oneTimeDate: [''],
      retryCount: [3, [Validators.min(0), Validators.max(5)]],
      retryStrategy: ['Fixed Delay'],
      notifyOn: ['Never'],
      isActive: [true]
    });
  }

  onSubmit() {
    // if (this.cronForm.invalid) {
    //   this.cronForm.markAllAsTouched();
    //   return;
    // }

    if (this.cronForm.invalid) {
      // Debug top-level controls
      Object.keys(this.cronForm.controls).forEach(key => {
        const controlErrors = this.cronForm.get(key)?.errors;
        if (controlErrors) {
          console.error(`Field invalid: ${key}`, controlErrors);
        }
      });

      // Debug header array controls
      this.headersArray.controls.forEach((group, index) => {
        if (group.invalid) {
           console.error(`Header at index ${index} is invalid. Key: ${group.get('key')?.value}, Value: ${group.get('value')?.value}`);
        }
      });

      this.cronForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Construct the final data based on selected schedule type
    const rawValue = this.cronForm.value;
    
    let finalScheduleExpression = rawValue.scheduleExpression;
    if (rawValue.scheduleType === 'interval') {
      finalScheduleExpression = `${rawValue.intervalValue}${rawValue.intervalUnit}`;
    } else if (rawValue.scheduleType === 'one-time') {
      finalScheduleExpression = rawValue.oneTimeDate;
    }

    // Transform [{key: 'Auth', value: 'Token'}] into { 'Auth': 'Token' }
    const formattedHeaders: Record<string, string> = {};
    if (rawValue.headers && Array.isArray(rawValue.headers)) {
      rawValue.headers.forEach((h: {key: string, value: string}) => {
        if (h.key && h.key.trim() !== '') {
          formattedHeaders[h.key] = h.value;
        }
      });
    }

    const requestData: CronCreateRequest = {
      cronName: rawValue.cronName,
      description: rawValue.description,
      endpointUrl: rawValue.endpointUrl,
      httpMethod: rawValue.httpMethod,
      scheduleType: rawValue.scheduleType,
      scheduleExpression: finalScheduleExpression,
      isActive: rawValue.isActive,
      timeoutSeconds: rawValue.timeoutSeconds,
      headers: formattedHeaders,
      payload: rawValue.payload,
      retryCount: rawValue.retryCount,
      retryStrategy: rawValue.retryStrategy,
      notifyOn: rawValue.notifyOn
    };

    this.cronService.addCronJobs(requestData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.isSubmitting = false;
        this.cronState.refresh();
        this.router.navigate(['/cronjobs'])
      }, error: (err: any) => {
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }

  get f() {
    return this.cronForm.controls;
  }

  get headersArray(): FormArray {
    return this.cronForm.get('headers') as FormArray;
  }

  addHeader() {
    this.headersArray.push(this.fb.group({
      key: [this.headerKeyOptions[0], Validators.required],
      value: ['', Validators.required]
    }));
  }

  removeHeader(index: number) {
    this.headersArray.removeAt(index);
  }
}
