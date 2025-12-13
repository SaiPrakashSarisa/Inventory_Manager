import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ButtonModule, 
    InputTextModule, 
    PasswordModule,
    DropdownModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  isSignupMode = false;
  isLoading = false;
  errorMessage = '';

  signupForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', [Validators.required]],
    tenantId: [''],
    role: ['staff'] // Default role
  });

  constructor() {}

  onLogin() {
    this.router.navigate(['/dashboard']);
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const signupData: SignupRequest = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        name: this.signupForm.value.name,
        loginMethod: 'jwt',
        ...(this.signupForm.value.tenantId && { tenantId: this.signupForm.value.tenantId }),
        ...(this.signupForm.value.role && { role: this.signupForm.value.role })
      };

      this.authService.signupWithEmail(signupData).subscribe({
        next: (response) => {
          if (response.success) {
            // Store token if JWT
            if (response.data.token) {
              localStorage.setItem('token', response.data.token);
            }
            if (response.data.customToken) {
              localStorage.setItem('customToken', response.data.customToken);
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('loginMethod', response.data.loginMethod);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Signup failed. Please try again.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || error.message || 'Signup failed. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  
  onGoogleLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signupWithGoogle().subscribe({
      next: (response) => {
        if (response.success) {
          // Store token/customToken
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data.customToken) {
            localStorage.setItem('customToken', response.data.customToken);
          }
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('loginMethod', response.data.loginMethod);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Google login failed. Please try again.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || error.message || 'Google login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onGoogleSignup() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signupWithGoogle().subscribe({
      next: (response) => {
        if (response.success) {
          // Store token/customToken
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data.customToken) {
            localStorage.setItem('customToken', response.data.customToken);
          }
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('loginMethod', response.data.loginMethod);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Google signup failed. Please try again.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || error.message || 'Google signup failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  showSignup() {
    this.isSignupMode = true;
    this.errorMessage = '';
    this.signupForm.reset({ role: 'staff' });
  }

  showLogin() {
    this.isSignupMode = false;
    this.errorMessage = '';
    this.signupForm.reset({ role: 'staff' });
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get name() {
    return this.signupForm.get('name');
  }

  get tenantId() {
    return this.signupForm.get('tenantId');
  }

  get role() {
    return this.signupForm.get('role');
  }

  roleOptions = [
    { label: 'Staff', value: 'staff' },
    { label: 'Admin', value: 'admin' }
  ];
}

