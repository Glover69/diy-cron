import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleUser, Schedule } from '../../../models/data.models';
import { environment } from '../../../environments/environment';
import { GoogleAuthService } from '../../../services/google-auth.service';
import { ButtonComponent } from '../../components/new/button/button.component';
import { InputFieldBaseComponent } from '../../components/new/input-field-base/input-field-base.component';
import { finalize, generate } from 'rxjs';
import { Router } from '@angular/router';
import { DrawerComponent } from '../../components/new/drawer/drawer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { DialogComponent } from '../../components/new/dialog/dialog.component';
import { CarouselComponent } from "../../components/carousel/carousel.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    DrawerComponent,
    InputFieldBaseComponent,
    DialogComponent,
    CarouselComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  schedules: Schedule[] = [];
  emojiOptions = [
    { icon: '😞', label: 'Poor' },
    { icon: '😐', label: 'Fair' },
    { icon: '👍', label: 'Good' },
    { icon: '👌', label: 'Great' },
    { icon: '🔥', label: 'Excellent' },
  ];

  navItems = [
    { label: 'Dashboard', link: '/home/dashboard', icon: 'speedometer'},
    { label: 'CronJobs', link: '/home/cronjobs', icon: 'timer'},
    { label: 'Execution Logs', link: '/home/logs', icon: 'read-cv-logo'},
  ]

  statCards = [
    { label: 'Total Jobs', value: '4', img: 'box', icon: 'package'},
    { label: 'Active Jobs', value: '4', img: 'infinity', icon: 'infinity'},
    { label: "Today's Executions", value: '4', img: 'alarm', icon: 'timer'},
  ]

  // ...existing code...

cronJobs = [
  {
    id: 1,
    name: 'Email Daily Report',
    url: 'https://api.myapp.com/email',
    schedule: '0 9 * * *',
    scheduleLabel: 'Every day at 9:00 am',
    nextRun: '15h, 45m',
    status: 'active',
    img: 'package'
  },
  {
    id: 2,
    name: 'Database Backup',
    url: 'https://api.myapp.com/backup',
    schedule: '0 0 * * *',
    scheduleLabel: 'Every day at midnight',
    nextRun: '8h, 12m',
    status: 'active',
    img: 'package'
  },
  {
    id: 3,
    name: 'Clear Cache',
    url: 'https://api.myapp.com/cache/clear',
    schedule: '*/30 * * * *',
    scheduleLabel: 'Every 30 minutes',
    nextRun: '0h, 12m',
    status: 'active',
    img: 'package'
  },
  {
    id: 4,
    name: 'Sync Inventory',
    url: 'https://api.myapp.com/inventory/sync',
    schedule: '0 */6 * * *',
    scheduleLabel: 'Every 6 hours',
    nextRun: '3h, 05m',
    status: 'warning',
    img: 'package'
  },
  {
    id: 5,
    name: 'Send Notifications',
    url: 'https://api.myapp.com/notify',
    schedule: '0 8 * * 1',
    scheduleLabel: 'Every Monday at 8:00 am',
    nextRun: '2d, 14h',
    status: 'active',
    img: 'package'
  }
];

  feedbackForm: FormGroup;
  selectedRating!: string;

  clientId = environment.googleClientId;
  user!: GoogleUser | null;
  first_name?: string = '';

  // Mobile sidebar state
  isSidebarOpen = false;
  isLoading = false;
  isDeleteLoading: boolean = false;
  isDeleteDialogOpen = false;
  scheduleToDelete: Schedule | null = null;

  greeting = 'Hello';
  private greetingTimer?: number;

  drawerOpen = false;
  selectedSchedule: Schedule | null = null;

  isFeedbackDialogOpen: boolean = false;
  isFeedbackLoading: boolean = false;
  isLogoutLoading: boolean = false;
  isLogoutDialogOpen: boolean = false;

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.feedbackForm = this.fb.group({
      rating: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  ngOnInit() {
    this.updateGreeting();
    this.greetingTimer = window.setInterval(
      () => this.updateGreeting(),
      60_000,
    );

    this.user = this.googleAuthService.currentUser();

    this.first_name = this.user?.name.split(' ')[0];
    if (this.user != null) {
      this.fetchSchedules();
    } else {
      // no user; stop loading so empty/login UI can show
      this.isLoading = false;
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

  private fetchSchedules() {}

  // Toggle helpers
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  openSchedulePreview(schedule: Schedule) {
    this.selectedSchedule = schedule;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
    // this.selectedSchedule = null;
  }

  editSchedule(schedule: Schedule) {
    // Navigate to edit mode using the proper route
    this.router.navigate(['/add-schedule/edit', schedule.schedule_id]);
  }

  deleteSchedule(schedule: Schedule, event: Event) {
    event.stopPropagation();

    // Open confirmation dialog instead of browser confirm
    this.scheduleToDelete = schedule;
    this.isDeleteDialogOpen = true;
  }

  confirmDelete() {}

  closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
    this.scheduleToDelete = null;
  }

  loadAllSchedules() {
    const saved = localStorage.getItem('schedulr-schedules');

    if (saved) {
      console.log(JSON.parse(saved));
      this.schedules = JSON.parse(saved);
    } else {
      console.log('not found');
    }

    return saved ? JSON.parse(saved) : [];
  }

  loadSpecificSchedule(id: number) {
    const schedules = this.loadAllSchedules();
    return schedules.find((schedule: any) => schedule.id === id);
  }

  downloadSchedule(schedule: Schedule) {}

  exportToICS(id: number) {}

  // Feedback form functions

  selectRating(label: string) {
    this.selectedRating = label;
    this.feedbackForm.patchValue({ rating: label });
    console.log(this.feedbackForm.get('rating')?.value);
    console.log(this.feedbackForm.value);
  }

  getRatingButtonClass(label: string): string {
    const baseClass = 'flex-1 p-4 rounded-lg border-2 transition-colors';
    if (this.selectedRating === label) {
      return `${baseClass} border-blue-500 bg-blue-50`;
    }
    return `${baseClass} border-gray-200 hover:border-gray-300`;
  }

  onSubmit() {}

  onClose() {
    this.isFeedbackDialogOpen = false;
    this.resetForm();
  }

  private resetForm() {
    this.feedbackForm.reset({
      rating: '',
      message: '',
    });
  }

  logout() {
    // Open confirmation dialog instead of logging out immediately
    this.isLogoutDialogOpen = true;
  }

  async confirmLogout() {
    this.isLogoutLoading = true;

    try {
      await this.googleAuthService.logout();
      this.toastService.showToast(
        'Logged out successfully',
        'You have been logged out. Redirecting to login...',
      );

      // Close dialog first
      this.isLogoutDialogOpen = false;
      this.isLogoutLoading = false;

      // Small delay to show the toast, then redirect
      // setTimeout(() => {
      //   this.router.navigate(['/auth']);
      // }, 500);
      this.router.navigate(['/auth']);
    } catch (error) {
      console.error('Logout failed:', error);
      this.toastService.showToast(
        'Logout failed',
        'There was an error logging out. Please try again.',
      );
      this.isLogoutLoading = false;
    }
  }

  closeLogoutDialog() {
    if (!this.isLogoutLoading) {
      this.isLogoutDialogOpen = false;
    }
  }
}
