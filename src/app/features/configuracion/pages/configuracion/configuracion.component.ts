import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/domain/models/user.model';
import { UsuariosService } from '../../../../core/application/use-cases/usuarios.service';
import { DashboardService } from '../../../../core/application/use-cases/dashboard.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent implements OnInit {
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
      this.usuariosService.editUsuario(this.currentUser).subscribe(
        () => {
          this.loadUsers();
          this.cancelEdit();
        },
        (error) => {
          console.error('Error al actualizar usuario', error);
        }
      );
    } else {
      this.http.post('/api/v1/usuarios', this.currentUser).subscribe(
        () => {
          this.loadUsers();
          this.cancelEdit();
        },
        (error) => {
          console.error('Error al agregar usuario', error);
        }
      );
    }
  }


  editUser(user: User) {
    console.log(user)
    this.editingUser = user;
    this.currentUser = { ...user };
    this.showAddUserForm = true;
  }

  deleteUser(cedula: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.http.delete(`/api/v1/usuarios/${cedula}`).subscribe(
        () => {
          this.loadUsers();
        },
        (error) => {
          console.error('Error al eliminar usuario', error);
        }
      );
    }
  }

  cancelEdit() {
    this.showAddUserForm = false;
    this.editingUser = null;
    this.currentUser = { cedula: '', nombre: '', email: '' };
  }
}
