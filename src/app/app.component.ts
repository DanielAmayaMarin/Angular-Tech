import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isSidebarOpen = true;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    // Implementa aquí la lógica de cierre de sesión
    console.log('Cerrando sesión...');
    // Por ejemplo, podrías navegar a la página de inicio de sesión:
    // this.router.navigate(['/login']);
  }
}
