import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { CommonModule } from '@angular/common';
import { PaisesComponent } from '../paises/paises.component';

@Component({
  selector: 'app-tabs-component',
  standalone: true,
  imports: [CommonModule, UsersComponent, PaisesComponent],
  templateUrl: './tabs-component.component.html'
})
export class TabsComponentComponent {
  tabs = [
    { id: 'users', label: 'Usuarios' },
    { id: 'paises', label: 'Paises' }
  ];
  
  activeTab: string = 'users';

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}
