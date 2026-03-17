import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleUser } from '../../../models/data.models';
import { GoogleAuthService } from '../../../services/google-auth.service';
import { ButtonComponent } from '../../components/new/button/button.component';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import {
  ReactiveFormsModule,
} from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLinkWithHref,
    RouterLinkActive
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {


  navItems = [
    { label: 'Dashboard', link: '/home/dashboard', icon: 'speedometer', exact: true },
    { label: 'CronJobs', link: '/home/cronjobs', icon: 'timer', exact: false },
    { label: 'Execution Logs', link: '/home/execution-logs', icon: 'read-cv-logo', exact: false },
  ]

  user!: GoogleUser | null;

  // Mobile sidebar state
  isSidebarOpen = false;

  constructor(
    private googleAuthService: GoogleAuthService,
  ) {

  }


  ngOnInit() {
    this.user = this.googleAuthService.currentUser();
  }

    // Toggle helpers
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebar() {
    this.isSidebarOpen = false;
  }

}
