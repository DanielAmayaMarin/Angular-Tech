import { Observable } from 'rxjs';

export interface AuthPort {
  login(email: string, password: string): Observable<string>;
  logout(): Observable<void>;
  register(cedula:string, nombre:string, apellidos:string, telefono:string, email:string, password:string, rutaImagenPerfil?:string): Observable<string>
}