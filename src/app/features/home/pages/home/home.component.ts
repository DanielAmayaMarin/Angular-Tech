import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/application/use-cases/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

    isSidebarOpen = true;
  
    constructor(private authService: AuthService, private router: Router) {}
  
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  
    logout() {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
}
