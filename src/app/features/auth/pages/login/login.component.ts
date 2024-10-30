import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/application/use-cases/auth.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../components/AlertComponent';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  alertMessage: string = '';
  alertType: 'error' | 'success' = 'error';
  showAlert: boolean = false;
  private alertTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          let errorMessage = error instanceof Error ? error.message : String(error);
          const errorPrefix = "Error: ";
          if (errorMessage.startsWith(errorPrefix)) {
            errorMessage = errorMessage.substring(errorPrefix.length);
          }
          this.showAlertWithTimer('error', errorMessage || 'Ha ocurrido un error al iniciar sesión');
        }
      });
    }
  }

  ngOnDestroy() {
    this.clearAlertTimer();
  }

  showAlertWithTimer(type: 'error' | 'success', message: string) {
    this.showAlert = true;
    this.alertType = type;
    this.alertMessage = message;
    this.clearAlertTimer();
    this.alertTimer = setTimeout(() => {
      this.onAlertClosed();
    }, 8000);
  }

  onAlertClosed() {
    this.showAlert = false;
    this.clearAlertTimer();
  }

  private clearAlertTimer() {
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
      this.alertTimer = null;
    }
  }
}