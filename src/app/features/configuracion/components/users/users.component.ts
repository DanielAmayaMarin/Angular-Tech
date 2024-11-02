import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/domain/models/user.model';
import { UsuariosService } from '../../../../core/application/use-cases/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  currentUser: User = { cedula: '', nombre: '', email: '', apellidos:"", telefono:"" };
  showAddUserForm = false;
  editingUser: User | null = null;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usuariosService.getUsuarios().subscribe(
      (data) => {
        this.users = data.data;
      },
      (error) => {
        console.error('Error al cargar usuarios', error);
      }
    );
  }


  submitUser() {
    if (this.editingUser) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres actualizar este usuario?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuariosService.editUsuario(this.currentUser).subscribe(
            () => {
              this.loadUsers();
              this.cancelEdit();
              Swal.fire(
                '¡Actualizado!',
                'El usuario ha sido actualizado.',
                'success'
              );
            },
            (error) => {
              console.error('Error al actualizar usuario', error);
              Swal.fire(
                'Error',
                'No se pudo actualizar el usuario.',
                'error'
              );
            }
          );
        }
      });
    } else {
      this.http.post('/api/v1/usuarios', this.currentUser).subscribe(
        () => {
          this.loadUsers();
          this.cancelEdit();
          Swal.fire(
            '¡Agregado!',
            'El usuario ha sido agregado.',
            'success'
          );
        },
        (error) => {
          console.error('Error al agregar usuario', error);
          Swal.fire(
            'Error',
            'No se pudo agregar el usuario.',
            'error'
          );
        }
      );
    }
  }

  editUser(user: User) {
    this.editingUser = user;
    this.currentUser = { ...user };
    this.showAddUserForm = true;
  }

  deleteUser(cedula: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Estás seguro de que quieres eliminar este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(cedula).subscribe(
          () => {
            this.loadUsers();
            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
          },
          (error) => {
            console.error('Error al actualizar usuario', error);
            Swal.fire(
              'Error',
              'No se pudo actualizar el usuario.',
              'error'
            );
          }
        );
      }
    });
  }

  cancelEdit() {
    this.showAddUserForm = false;
    this.editingUser = null;
    this.currentUser = { cedula: '', nombre: '', email: '' };
  }

}
