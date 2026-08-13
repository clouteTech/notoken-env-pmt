import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Shared, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  showEmailScreen = true;
  showOtpScreen = false;
  error = '';
  otp = '';

  sendOtpResponse: any;

  private fb = inject(FormBuilder);

  constructor(private auth: AuthService, private router: Router, private apiService: Apiservice, private messageService: MessageService) {}
  
  sendOtpForm = this.fb.group({
    email: ['']
  })

  validateOtpForm = this.fb.group({
    email: [''],
    otp: [null]
  })

  ngOnInit(): void {
    sessionStorage.clear();
  }

  // onSubmit() {
  //   this.error = '';
  //   if (!this.username.trim()) {
  //     this.error = 'Please enter your email.';
  //     return;
  //   }
  //   this.loading = true;
  //   setTimeout(() => {
  //     const ok = this.auth.login(this.username.trim());
  //     this.loading = false;
  //     if (ok) {
  //       this.showOtpScreen = true;
  //       this.showEmailScreen = false;
  //       console.log('OTP = 123456');
  //     } else {
  //       this.error = 'Invalid email. Please try again.';
  //     }
  //   }, 600);
  // }

  onSubmit() {
    try {
      this.error = '';
      if (this.sendOtpForm.get('email')?.value === '') {
        this.error = 'Please enter your email.';
        return;
      }
      console.log(this.sendOtpForm.value);
  
      const data = this.sendOtpForm.value;
      console.log(data);
  
      this.loading = true;
      this.apiService.sendOtp(data).subscribe({
        next: val => {
          console.log(val);
          this.showOtpScreen = true;
          this.showEmailScreen = false;

          this.sendOtpResponse = val.data;
  
          this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `OTP has been sent successfully to your ${this.sendOtpForm.get('email')?.value} email.`
            });
          },
        error: err => {
          console.log(err);
  
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
      
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  // verifyOtp(){
  //   if (this.otp === '123456') {
  //     this.router.navigate(['/foundation1']);
  //     return;
  //   } else {
  //     this.error = 'Invalid OTP';
  //   }
  // }

  verifyOtp(){
    try {
      console.log(this.validateOtpForm.value);

      this.validateOtpForm.patchValue({
        email: this.sendOtpResponse.email
      })

      const data = this.validateOtpForm.value;

      console.log(data);

      this.apiService.validateOtp(data).subscribe({
        next: val => {
          this.auth.setUser(this.sendOtpResponse.email);
          console.log(val);
          sessionStorage.setItem("token", val.data.token);

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successfully' });
          this.router.navigate(['/foundation1']);
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
}
