import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ButtonComponent } from '../../components/new/button/button.component';


@Component({
  selector: 'app-auth',
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  clientId = environment.googleClientId

  constructor() {

  }

  loginWithGoogle(): void {
  const params = new URLSearchParams({
    client_id: environment.googleClientId,
    redirect_uri: environment.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
}
