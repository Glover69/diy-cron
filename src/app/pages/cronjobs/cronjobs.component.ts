import {Component, ElementRef, inject, NgZone, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DatePipe, NgTemplateOutlet} from '@angular/common';
import { ButtonComponent } from '../../components/new/button/button.component';
import { TabGroupComponent } from '../../components/tab-group/tab-group.component';
import { TabComponent } from '../../components/tab-group/tab/tab.component';
import { CronJob } from '../../../models/data.models';
import { SheetComponent } from "../../components/new/sheet/sheet.component";
import {CronStateService} from '../../../services/cron-state.service';
import {TimeUntilPipe} from '../../../utils/time-utils.pipe';
import gsap from 'gsap';
import { CronService } from '../../../services/cron.service';

@Component({
  selector: 'app-cronjobs',
  imports: [ButtonComponent, TabGroupComponent, TabComponent, NgTemplateOutlet, SheetComponent, TimeUntilPipe, DatePipe],
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

  getCurrentSelectedJob(job: CronJob){
    this.currentSelectedJob = job;

    if(this.currentSelectedJob != null){
      this.sheetOpen = !this.sheetOpen
    }
  }


}
