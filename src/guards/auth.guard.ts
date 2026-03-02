import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { GoogleAuthService } from '../services/google-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private googleAuthService: GoogleAuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      // Hydrate once to verify cookie is valid
      await this.googleAuthService.hydrate();
      
      const user = this.googleAuthService.currentUser();
      
      console.log('Auth Guard - User:', user);

      if (!user) {
        console.log('Auth Guard - No user found, redirecting to auth');
        this.router.navigate(['/auth'], { queryParams: { redirect: state.url } });
        return false;
      }
      
      console.log('Auth Guard - User authenticated, allowing access');
      return true;
    } catch (error) {
      console.error('Auth Guard - Error during authentication check:', error);
      this.router.navigate(['/auth'], { queryParams: { redirect: state.url } });
      return false;
    }
  }
}