export interface User {
  id?: string;
  cedula: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
}

export interface ApiResponse<T = any> {
  codigo: number;
  data: T;
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

export interface Pais {
  nombre: string;
  poblacion: number
  area_km2: number;
  continente: string;
}

export interface UserProfile {
  cedula: string;
  apellidos: string;
  email: string;
  nombre: string;
  telefono: string;
}