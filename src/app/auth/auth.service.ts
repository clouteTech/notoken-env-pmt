import { Injectable, signal } from '@angular/core';

export interface User {
  username: string;
  role: string;
  displayName: string;
}

const USERS: Record<string, { password: string; user: User }> = {
  siteengineer_user1: {
    password: '123456',
    user: { username: 'siteengineer_user1', role: 'Site Engineer', displayName: 'Site Engineer' }
  }
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  login(username: string, password: string): boolean {
    const entry = USERS[username];
    if (entry && entry.password === password) {
      this._user.set(entry.user);
      sessionStorage.setItem('auth_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    sessionStorage.removeItem('auth_user');
  }

  isLoggedIn(): boolean {
    if (this._user()) return true;
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
        return true;
      } catch { return false; }
    }
    return false;
  }

  restore(): void {
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      try { this._user.set(JSON.parse(stored)); } catch {}
    }
  }
}
