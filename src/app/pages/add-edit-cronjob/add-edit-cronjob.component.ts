import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFieldBaseComponent } from '../../components/new/input-field-base/input-field-base.component';
import { SelectComponent } from '../../components/inputs/select/select.component';
import { ButtonComponent } from '../../components/new/button/button.component';
import { CronCreateRequest, CronJob } from '../../../models/data.models';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { CronService } from '../../../services/cron.service';
import { CronStateService } from '../../../services/cron-state.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-edit-cronjob',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldBaseComponent, SelectComponent, ButtonComponent, EditorComponent],
  templateUrl: './add-edit-cronjob.component.html',
  styleUrl: './add-edit-cronjob.component.css'
})
export class AddEditCronjobComponent implements OnInit {
  cronForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  cronId: string | null = null;
  isLoading = false;
  cronService = inject(CronService);
  cronState = inject(CronStateService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  editorOptions = {theme: 'vs-dark', language: 'json', automaticLayout: true, minimap: {enabled: false}, scrollBeyondLastLine: false, formatOnPaste: true, formatOnType: true};

  httpMethodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  scheduleTypeOptions = [
    {label: 'Cron Expression', value: 'cron'},
    {label: 'Interval', value: 'interval'},
    {label: 'One-Time', value: 'one-time'},
  ];
  retryStrategies = ['Fixed', 'Exponential'];
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

  // Simple array for the select component display
  intervalUnitSimpleOptions = ['s', 'm', 'h', 'd'];
  intervalUnitLabels: {[key: string]: string} = {
    's': 'seconds',
    'm': 'minutes',
    'h': 'hours',
    'd': 'days'
  };

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
      retryDelay: [5, [Validators.min(1)]],
      retryStrategy: ['Fixed'],
      notifyOn: ['Never'],
      webhookURL: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['cronId']) {
        this.isEditMode = true;
        this.cronId = params['cronId'];
        this.loadCronJobData(params['cronId']);
      }
    });
  }

  private loadCronJobData(cronId: string) {
    this.isLoading = true;
    const allJobs = this.cronState.cronJobs();
    const job = allJobs.find(j => j.cronId === cronId);

    if (job) {
      this.populateFormWithCronData(job);
      this.isLoading = false;
    } else {
      // If job not found in state, try refreshing
      this.cronState.load();
      // Small delay to wait for state update
      setTimeout(() => {
        const updatedJobs = this.cronState.cronJobs();
        const foundJob = updatedJobs.find(j => j.cronId === cronId);
        if (foundJob) {
          this.populateFormWithCronData(foundJob);
        }
        this.isLoading = false;
      }, 500);
    }
  }

  private populateFormWithCronData(job: CronJob) {
    // Parse schedule expression to populate schedule fields
    let scheduleType = job.scheduleType;
    let scheduleExpression = job.scheduleExpression;
    let intervalValue = 15;
    let intervalUnit = 'h';
    let oneTimeDate = '';

    if (scheduleType === 'interval' && scheduleExpression) {
      // Parse interval format like "15s", "30m", "2h", "1d"
      const match = scheduleExpression.match(/^(\d+)([smhd])$/);
      if (match) {
        intervalValue = parseInt(match[1], 10);
        intervalUnit = match[2];
        scheduleExpression = '';
        console.log(`Parsed interval: value=${intervalValue}, unit=${intervalUnit}`);
      }
    } else if (scheduleType === 'one-time') {
      oneTimeDate = scheduleExpression;
      scheduleExpression = '';
    }

    // Convert headers from Record<string, string> to {key, value}[] format
    const headersArray: Array<{key: string, value: string}> = [];
    if (job.headers && typeof job.headers === 'object') {
      Object.entries(job.headers).forEach(([key, value]) => {
        headersArray.push({key, value: String(value)});
      });
    }

    // Populate the form
    this.cronForm.patchValue({
      cronName: job.cronName,
      description: job.description || '',
      endpointUrl: job.endpointUrl,
      httpMethod: job.httpMethod,
      timeoutSeconds: job.timeoutSeconds || 30,
      payload: job.payload || '{\n  \n}',
      scheduleType: scheduleType,
      scheduleExpression: scheduleExpression,
      intervalValue: intervalValue,
      intervalUnit: intervalUnit,
      oneTimeDate: oneTimeDate,
      retryCount: job.retryCount || 3,
      retryDelay: job.retryDelay || 5,
      retryStrategy: job.retryStrategy || 'Fixed',
      notifyOn: job.notifyOn || 'Never',
      webhookURL: job.webhookURL || '',
      isActive: job.isActive
    });

    // Clear and populate headers FormArray
    while (this.headersArray.length > 0) {
      this.headersArray.removeAt(0);
    }
    headersArray.forEach(header => {
      this.headersArray.push(this.fb.group({
        key: [header.key, Validators.required],
        value: [header.value, Validators.required]
      }));
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
      jobStatus: rawValue.isActive ? 'ACTIVE' : 'PAUSED',
      timeoutSeconds: rawValue.timeoutSeconds,
      headers: formattedHeaders,
      payload: rawValue.payload,
      retryCount: rawValue.retryCount,
      retryDelay: rawValue.retryDelay,
      retryStrategy: rawValue.retryStrategy,
      notifyOn: rawValue.notifyOn,
      webhookURL: rawValue.webhookURL || undefined
    };

    // Call create or update based on mode
    const request$ = this.isEditMode && this.cronId
      ? this.cronService.updateCronJobs(this.cronId, requestData)
      : this.cronService.addCronJobs(requestData);

    request$.subscribe({
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
