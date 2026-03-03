import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonComponent } from '../../components/new/button/button.component';
import { TabGroupComponent } from '../../components/tab-group/tab-group.component';
import { TabComponent } from '../../components/tab-group/tab/tab.component';
import { CronJob } from '../../../models/data.models';

@Component({
  selector: 'app-cronjobs',
  imports: [ButtonComponent, TabGroupComponent, TabComponent, NgTemplateOutlet],
  templateUrl: './cronjobs.component.html',
  styleUrl: './cronjobs.component.css'
})
export class CronjobsComponent {
  isLoading = false;

  cronJobs: CronJob[] = [
    { id: 1, name: 'Email Daily Report', url: 'https://api.myapp.com/email', schedule: '0 9 * * *', scheduleLabel: 'Every day at 9:00 am', nextRun: '15h, 45m', status: 'active', img: 'package' },
    { id: 2, name: 'Database Backup', url: 'https://api.myapp.com/backup', schedule: '0 0 * * *', scheduleLabel: 'Every day at midnight', nextRun: '8h, 12m', status: 'active', img: 'package' },
    { id: 3, name: 'Clear Cache', url: 'https://api.myapp.com/cache/clear', schedule: '*/30 * * * *', scheduleLabel: 'Every 30 minutes', nextRun: '0h, 12m', status: 'active', img: 'package' },
    { id: 4, name: 'Sync Inventory', url: 'https://api.myapp.com/inventory/sync', schedule: '0 */6 * * *', scheduleLabel: 'Every 6 hours', nextRun: '3h, 05m', status: 'warning', img: 'package' },
    { id: 5, name: 'Send Notifications', url: 'https://api.myapp.com/notify', schedule: '0 8 * * 1', scheduleLabel: 'Every Monday at 8:00 am', nextRun: '2d, 14h', status: 'inactive', img: 'package' },
  ];

  get activeJobs(): CronJob[] {
    return this.cronJobs.filter(j => j.status === 'active');
  }

  get warningJobs(): CronJob[] {
    return this.cronJobs.filter(j => j.status === 'warning');
  }

  get inactiveJobs(): CronJob[] {
    return this.cronJobs.filter(j => j.status === 'inactive');
  }
}
