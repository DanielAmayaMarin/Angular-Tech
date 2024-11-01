import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthHttpAdapter } from './core/infrastructure/adapters/auth-http.adapter';
import { authInterceptor } from './core/infrastructure/interceptors/auth.interceptor';
import { UsuariosHttpAdapter } from './core/infrastructure/adapters/usuarios-http.adapter';
import { DashboardHttpAdapter } from './core/infrastructure/adapters/dashboard-http.adapter';
import { ProduccionEnergiaHttpAdapter } from './core/infrastructure/adapters/produccion-energia-http-adapter';
import { ConsumoEnergiaHttpAdapter } from './core/infrastructure/adapters/consumo-energia-http-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: 'AuthRepositoryPort', useClass: AuthHttpAdapter },
    { provide: 'UsuariosRepositoryPort', useClass: UsuariosHttpAdapter },
    { provide: 'DashboardRepositoryPort', useClass: DashboardHttpAdapter },
    { provide: 'ProduccionEnergiaRepositoryPort', useClass: ProduccionEnergiaHttpAdapter },
    { provide: 'ConsumoEnergiaRepositoryPort', useClass: ConsumoEnergiaHttpAdapter }
  ]
};
