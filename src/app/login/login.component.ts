import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Shared],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  showEmailScreen = true;
  showOtpScreen = false;
  error = '';
  otp = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    if (!this.username.trim()) {
      this.error = 'Please enter your email.';
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const ok = this.auth.login(this.username.trim());
      this.loading = false;
      if (ok) {
        this.showOtpScreen = true;
        this.showEmailScreen = false;
        console.log('OTP = 123456');
      } else {
        this.error = 'Invalid email. Please try again.';
      }
    }, 600);
  }

  verifyOtp(){
    if (this.otp === '123456') {
      this.router.navigate(['/foundation1']);
      return;
    } else {
      this.error = 'Invalid OTP';
    }
  }
}
