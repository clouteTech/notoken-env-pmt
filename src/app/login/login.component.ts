import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    this.error = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter your username and password.';
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const ok = this.auth.login(this.username.trim(), this.password);
      this.loading = false;
      if (ok) {
        this.router.navigate(['/foundation1']);
      } else {
        this.error = 'Invalid username or password. Please try again.';
      }
    }, 600);
  }
}
