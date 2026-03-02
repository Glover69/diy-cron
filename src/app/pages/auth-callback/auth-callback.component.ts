import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponse } from '../../../models/data.models';
import { HttpClient } from '@angular/common/http';
import { GoogleAuthService } from '../../../services/google-auth.service';

@Component({
  selector: 'app-auth-callback',
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css',
})
export class AuthCallbackComponent {
  isProcessing = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  http = inject(HttpClient);
  googleAuthService = inject(GoogleAuthService);

  ngOnInit(): void {
    this.handleAuthCallback();
  }

  private handleAuthCallback(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        this.error = error;
        console.log(error);
        this.isProcessing = false;
        return;
      }

      if (code) {
        this.exchangeCodeForToken(code);
      } else {
        this.error = 'No authorization code received';
        this.isProcessing = false;
      }
    });
  }

  private exchangeCodeForToken(code: string): void {
    this.http
      .post<LoginResponse>(
        '/api/auth/google/callback',
        { code },
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: (response: LoginResponse) => {
          this.googleAuthService.setUser(response.user);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Authentication failed:', err);
          this.error =
            err.error?.message || 'Authentication failed. Please try again.';
          this.isProcessing = false;
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
