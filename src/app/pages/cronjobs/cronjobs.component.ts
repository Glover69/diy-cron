import {Component, ElementRef, inject, NgZone, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DatePipe, NgTemplateOutlet} from '@angular/common';
import { ButtonComponent } from '../../components/new/button/button.component';
import { TabGroupComponent } from '../../components/tab-group/tab-group.component';
import { TabComponent } from '../../components/tab-group/tab/tab.component';
import { CronJob, ExecutionLogs } from '../../../models/data.models';
import { SheetComponent } from "../../components/new/sheet/sheet.component";
import {CronStateService} from '../../../services/cron-state.service';
import {TimeUntilPipe} from '../../../utils/time-utils.pipe';
import gsap from 'gsap';
import { CronService } from '../../../services/cron.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cronjobs',
  imports: [ButtonComponent, TabGroupComponent, TabComponent, NgTemplateOutlet, SheetComponent, TimeUntilPipe, DatePipe, RouterLink],
  templateUrl: './cronjobs.component.html',
  styleUrl: './cronjobs.component.css'
})
export class CronjobsComponent implements OnInit{
  isLoading = false;
  sheetOpen: boolean = false;
  currentSelectedJob!: CronJob;
  cronState = inject(CronStateService)
  cronService = inject(CronService)
  private ngZone = inject(NgZone)
  router = inject(Router);
  currentSelectedLogs: ExecutionLogs[] = [];
  avgResTime: number = 0;

  @ViewChildren('CardJob') cardStatElements!: QueryList<ElementRef>;

  ngOnInit(){
    this.cronState.load();
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.animateDashboardCards(), 0);
    });
  }

  deleteCron(cronId: string){
    this.cronService.deleteCronJob(cronId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.cronState.refresh();
        this.router.navigate(['/cronjobs'])
      }, error: (err: any) => {
        console.error(err);
      }
    })
  }

  animateDashboardCards(){
    const cards = this.cardStatElements.toArray().map(i => i.nativeElement);

    if (!cards.length) return;

    gsap.fromTo(cards, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      ease: 'power2.inOut',
      stagger: 0.1,
    })
  }


  // Pagination & Filtering state
  currentLogPage: number = 0;
  totalLogPages: number = 0;
  totalLogItems: number = 0;
  logStatusFilter: string = 'ALL';
  logTimeframeFilter: string = 'ALL';

  getCurrentSelectedJob(job: CronJob){
    this.currentSelectedJob = job;

    // Reset log state when opening a new job
    this.currentLogPage = 0;
    this.logStatusFilter = 'ALL';
    this.logTimeframeFilter = 'ALL';
    this.fetchLogsForCurrentSelectedJob(job.cronId);

    if(this.currentSelectedJob != null){
      this.sheetOpen = true; // explicitly open instead of toggle
    }
  }

  fetchLogsForCurrentSelectedJob(cronId: string) {
    this.cronService.getLogsForACronJob(cronId, this.currentLogPage, 10, this.logStatusFilter, this.logTimeframeFilter).subscribe({
      next: (response) => {
        this.currentSelectedLogs = response.logs;
        this.currentLogPage = response.currentPage;
        this.totalLogPages = response.totalPages;
        this.totalLogItems = response.totalItems;
      },
      error: (err) => {
        console.error('Failed to fetch logs:', err);
      }
    });
  }

  changeLogPage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalLogPages) {
      this.currentLogPage = newPage;
      this.fetchLogsForCurrentSelectedJob(this.currentSelectedJob.cronId);
    }
  }

  changeLogStatusFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.logStatusFilter = select.value;
    this.currentLogPage = 0; // Reset to page 1 on filter change
    this.fetchLogsForCurrentSelectedJob(this.currentSelectedJob.cronId);
  }

  changeLogTimeframeFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.logTimeframeFilter = select.value;
    this.currentLogPage = 0; // Reset to page 1 on filter change
    this.fetchLogsForCurrentSelectedJob(this.currentSelectedJob.cronId);
  }

  getStatusBadgeClass(status: string, code: number): string {
    if (status === 'SUCCESS' || (code >= 200 && code < 300)) {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    if (code >= 400 && code < 500) {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    }
    return 'bg-red-100 text-red-700 border-red-200';
  }

  // calculateAvgResponseTime(logs: ExecutionLogs[]){
  //   let filteredNumbers: number[] = logs.sort((i) => i.responseTimeMS != null)
  //   return console.log(filteredNumbers);
  // }


}
