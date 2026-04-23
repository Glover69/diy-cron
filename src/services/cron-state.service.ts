// src/services/cron-state.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { CronJob } from '../models/data.models';
import { CronService } from './cron.service';

@Injectable({ providedIn: 'root' })
export class CronStateService {
  private cronService= inject(CronService);

  private _cronJobs = signal<CronJob[]>([]);
  private _isLoading = signal(false);

  // Public readonly signals
  readonly cronJobs = this._cronJobs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly activeJobs = computed(() => this._cronJobs().filter(j => j.jobStatus === 'ACTIVE'));
  readonly warningJobs = computed(() => this._cronJobs().filter(j => j.jobStatus === 'ISSUES'));
  readonly inactiveJobs = computed(() => this._cronJobs().filter(j => j.jobStatus === 'PAUSED'));

  load() {
    if (this._cronJobs().length > 0) return; // already loaded, skip
    this.refresh();
  }

  refresh() {
    this._isLoading.set(true);
    this.cronService.getAllCronJobs().subscribe({
      next: (jobs) => {
        this._cronJobs.set(jobs);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch cron jobs:', err);
        this._isLoading.set(false);
      }
    });
  }
}
