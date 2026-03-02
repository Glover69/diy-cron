import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Toast } from '../models/data.models';
import { ToastService } from '../services/toast.service';
import { ToastComponent } from './components/toast/toast.component';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'diy-cron';
  toastMessage: string = '';
  toastHeader: string = '';

  constructor(
    private router: Router,
    private toastService: ToastService,
    private googleAuthService: GoogleAuthService,
  ) {}

  async ngOnInit() {
    // Verify cookie is still valid once on startup
    await this.googleAuthService.hydrate();

    this.toastService.toast$.subscribe((toast: Toast) => {
      this.toastMessage = `${toast.message}`;
      this.toastHeader = `${toast.header}`;
      // Automatically hide the snackbar after 3.5 seconds
      setTimeout(() => {
        ((this.toastHeader = ''), (this.toastMessage = ''));
      }, 3500);
    });
  }

  get isAuthRoute(): boolean {
    return (
      this.router.url.includes('/auth') || this.router.url === '/auth-callback'
    );
  }

  get isLegalRoute(): boolean {
    return (
      this.router.url.includes('/privacy-policy') ||
      this.router.url.includes('/terms-of-service')
    );
  }
}
