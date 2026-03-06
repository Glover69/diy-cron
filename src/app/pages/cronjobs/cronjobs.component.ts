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
    { cronId: "1", httpMethod: 'GET', scheduleType: 'cron', isActive: true, cronName: 'Email Daily Report', endpointUrl: 'https://api.myapp.com/email', scheduleExpression: '0 9 * * *', scheduleLabel: 'Every day at 9:00 am', nextRunAt: '15h, 45m', status: 'active' },
    { cronId: "2", httpMethod: 'GET', scheduleType: 'cron', isActive: true, cronName: 'Database Backup', endpointUrl: 'https://api.myapp.com/backup', scheduleExpression: '0 0 * * *', scheduleLabel: 'Every day at midnight', nextRunAt: '8h, 12m', status: 'active' },
    { cronId: "3", httpMethod: 'GET', scheduleType: 'cron', isActive: true, cronName: 'Clear Cache', endpointUrl: 'https://api.myapp.com/cache/clear', scheduleExpression: '*/30 * * * *', scheduleLabel: 'Every 30 minutes', nextRunAt: '0h, 12m', status: 'active' },
    { cronId: "4", httpMethod: 'GET', scheduleType: 'cron', isActive: false, cronName: 'Sync Inventory', endpointUrl: 'https://api.myapp.com/inventory/sync', scheduleExpression: '0 */6 * * *', scheduleLabel: 'Every 6 hours', nextRunAt: '3h, 05m', status: 'warning' },
    { cronId: "5", httpMethod: 'GET', scheduleType: 'cron', isActive: false, cronName: 'Send Notifications', endpointUrl: 'https://api.myapp.com/notify', scheduleExpression: '0 8 * * 1', scheduleLabel: 'Every Monday at 8:00 am', nextRunAt: '2d, 14h', status: 'inactive' }
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
