export interface User {
  id?: string;
  cedula: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  rutaImagenPerfil?: string;
}

export interface ApiResponse {
  codigo: number;
  data: User[];
  mensaje: string;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  tipoInforme: string;
  continente: string;
  pais: string;
  tipoEnergia: string;
}