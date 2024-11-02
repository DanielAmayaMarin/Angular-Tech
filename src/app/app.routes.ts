import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { AuthGuard } from './core/infrastructure/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { ProduccionEnergiaComponent } from './features/produccionEnergia/pages/produccion-energia/produccion-energia.component';
import { ConsumoEnergeticoComponent } from './features/consumoEnergetico/pages/consumo-energetico/consumo-energetico.component';
import { InformesComponent } from './features/informes/pages/informes/informes.component';
import { ConfiguracionComponent } from './features/configuracion/pages/configuracion/configuracion.component';
import { RegistroComponent } from './features/auth/pages/registro/registro.component';
import { LoginGuard } from './core/infrastructure/guards/login.guard';
import { PerfilComponent } from './features/perfil/components/perfil/perfil.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'register', component: RegistroComponent },
    { 
      path: '', 
      component: HomeComponent, 
      canActivate: [AuthGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'produccion-energia', component: ProduccionEnergiaComponent },
        { path: 'consumo-energetico', component: ConsumoEnergeticoComponent },
        { path: 'informes', component: InformesComponent },
        { path: 'configuracion', component: ConfiguracionComponent },
        { path: 'perfil', component: PerfilComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
      ]
    },
    { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
  ];
