import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsComponentComponent } from '../../components/tabs-component/tabs-component.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, TabsComponentComponent],
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent{
 
}
