import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/application/use-cases/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

    isSidebarOpen = true;
    currentUser: any; 
  
    constructor(private authService: AuthService, private router: Router) {}
  
    getCurrentUser() {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Error al obtener el usuario actual:', error);
          this.router.navigate(['/login']);
        }
      });
    }

    ngOnInit() {
      this.getCurrentUser();
    }
    
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  
    logout() {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al cerrar sesión:', error);
          // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
      });
    }
}
