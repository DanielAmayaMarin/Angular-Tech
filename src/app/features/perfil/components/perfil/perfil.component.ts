import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfile } from '../../../../core/domain/models/user.model';
import { UsuariosService } from '../../../../core/application/use-cases/usuarios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private usuariosService:UsuariosService) {
    this.profileForm = this.fb.group({
      cedula: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.usuariosService.getUsuarioId().subscribe({
      next: (data) => {
        let mockUserData: UserProfile = {
          cedula: data.data.cedula,
          apellidos: data.data.apellidos,
          email: data.data.email,
          nombre: data.data.nombre,
          telefono: data.data.telefono
        };
        this.profileForm.patchValue(mockUserData);
        this.profileForm.markAsPristine();
      },
    })
  }


  onSubmit() {
    if (this.profileForm.valid && this.profileForm.dirty) {
    
      this.usuariosService.editUsuario(this.profileForm.value).subscribe(
        () => {
          this.ngOnInit();
          Swal.fire(
            '¡Actualizado!',
            'El usuario ha sido actualizado.',
            'success'
          );
        },
      )
      this.profileForm.markAsPristine();
    }
  }

  resetForm() {
    this.ngOnInit();
  }
}
