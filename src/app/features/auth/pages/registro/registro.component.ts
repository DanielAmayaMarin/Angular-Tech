import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/application/use-cases/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../../core/domain/models/user.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}



  ngOnInit() {
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required]],
      rutaImagenPerfil: ['']
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const userData: Omit<User, 'id'> = this.registroForm.value;
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}
