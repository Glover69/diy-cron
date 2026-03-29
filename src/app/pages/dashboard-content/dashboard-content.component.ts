import {Component, ElementRef, inject, NgZone, OnDestroy, OnInit, QueryList, signal, ViewChildren} from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { ButtonComponent } from '../../components/new/button/button.component';
import { CommonModule } from '@angular/common';
import { GoogleAuthService } from '../../../services/google-auth.service';
import { CronJob, GoogleUser } from '../../../models/data.models';
import { CronService } from '../../../services/cron.service';
import gsap from 'gsap';

@Component({
  selector: 'app-dashboard-content',
  imports: [CarouselComponent, ButtonComponent, CommonModule],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.css',
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  isLoading = signal(false);
  greeting = 'Hello';
  private greetingTimer?: number;
  user: GoogleUser | null = null;
  first_name?: string = '';

  allCrons: CronJob[] = []
  activeCrons: number | null = null;

  googleAuthService = inject(GoogleAuthService)
  cronService = inject(CronService)
  private ngZone = inject(NgZone)

  // Use ViewChildren to get a direct reference to card elements
  @ViewChildren('cardStat') cardStatElements!: QueryList<ElementRef>;

  // statCards = [
  //   { label: 'Total Jobs', value: 4, img: 'box', icon: 'package' },
  //   { label: 'Active Jobs', value: 3, img: 'infinity', icon: 'infinity' },
  //   { label: "Today's Executions", value: 4, img: 'alarm', icon: 'timer' },
  // ];


  cronJobs = [
    {
      id: 1,
      name: 'Email Daily Report',
      url: 'https://api.myapp.com/email',
      schedule: '0 9 * * *',
      scheduleLabel: 'Every day at 9:00 am',
      nextRun: '15h, 45m',
      status: 'active',
      img: 'package',
    },
    {
      id: 2,
      name: 'Database Backup',
      url: 'https://api.myapp.com/backup',
      schedule: '0 0 * * *',
      scheduleLabel: 'Every day at midnight',
      nextRun: '8h, 12m',
      status: 'active',
      img: 'package',
    },
    {
      id: 3,
      name: 'Clear Cache',
      url: 'https://api.myapp.com/cache/clear',
      schedule: '*/30 * * * *',
      scheduleLabel: 'Every 30 minutes',
      nextRun: '0h, 12m',
      status: 'active',
      img: 'package',
    },
    {
      id: 4,
      name: 'Sync Inventory',
      url: 'https://api.myapp.com/inventory/sync',
      schedule: '0 */6 * * *',
      scheduleLabel: 'Every 6 hours',
      nextRun: '3h, 05m',
      status: 'warning',
      img: 'package',
    },
    {
      id: 5,
      name: 'Send Notifications',
      url: 'https://api.myapp.com/notify',
      schedule: '0 8 * * 1',
      scheduleLabel: 'Every Monday at 8:00 am',
      nextRun: '2d, 14h',
      status: 'active',
      img: 'package',
    },
  ];

  ngOnInit() {
    this.updateGreeting();
    this.greetingTimer = window.setInterval(
      () => this.updateGreeting(),
      60_000,
    );

    this.user = this.googleAuthService.currentUser();

    this.first_name = this.user?.name.split(' ')[0];
    if (this.user != null) {
      this.fetchCrons()
    } else {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy() {
    if (this.greetingTimer) window.clearInterval(this.greetingTimer);
  }

  private updateGreeting(date: Date = new Date()) {
    const h = date.getHours(); // user’s local time
    if (h >= 0 && h < 12) this.greeting = 'Good morning';
    else if (h >= 12 && h < 16) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }


  fetchCrons(){
    this.isLoading.set(true)
    this.cronService.getAllCronJobs().subscribe({
      next: (res: CronJob[]) => {
        console.log(res);
        this.allCrons = res;
        this.activeCrons = this.allCrons.filter(i => i.isActive).length;
        this.isLoading.set(false);

        // Wait for Angular to render the cards into the DOM, then animate
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => this.animateDashboardCards(), 0);
        });

      }, error: (err: any) => {
        console.error("Failed to fetch users cron jobs: ", err);
        this.isLoading.set(false);
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
}
