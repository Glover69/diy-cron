import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GoogleUser, LoginResponse } from '../models/data.models';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private userSubject = new BehaviorSubject<GoogleUser | null>(null);
  private hydrated = false;
  private apiUrl = environment.apiRoute;

  currentUser = signal<GoogleUser | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored) as GoogleUser;
      this.currentUser.set(user);
      this.userSubject.next(user);
      this.isAuthenticated.set(true);
    }
  }

  private saveToStorage(user: GoogleUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem('user');
  }

  setUser(user: GoogleUser): void {
    this.currentUser.set(user);
    this.userSubject.next(user);
    this.isAuthenticated.set(true);
    this.saveToStorage(user);
  }

  async hydrate(): Promise<void> {
    console.log("Hydrated: ", this.hydrated)
    if (this.hydrated) return;
    try {
      const res = await firstValueFrom(
        this.http.get<GoogleUser>(`${this.apiUrl}/auth/me`, {
          withCredentials: true,
        }),
      );
      console.log("User founddd: ", res)
      const user = res ?? null;
      this.userSubject.next(user);
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);

      // Keep localStorage in sync with what backend says
      if (user) {
        this.saveToStorage(user);
      } else {
        this.clearStorage();
      }
    } catch(err: any) {
      // Cookie expired or invalid — clear everything
      console.log("Some error bi: ", err)
      if (err?.status === 401) {
        this.currentUser.set(null);
        this.userSubject.next(null);
        this.isAuthenticated.set(false);
        this.clearStorage();
      }
    } finally {
      this.hydrated = true;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(
          `${this.apiUrl}/auth/logout`,
          {},
          { withCredentials: true },
        ),
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
    this.currentUser.set(null);
    this.userSubject.next(null);
    this.isAuthenticated.set(false);
    this.clearStorage();
    this.hydrated = false;
  }
}
