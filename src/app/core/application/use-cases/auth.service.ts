import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthPort } from '../../domain/ports/auth.port';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthPort {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    let currentUser = null;
    try {
      const storedUser = localStorage.getItem('currentUser');
      currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing currentUser from localStorage:', error);
    }
    this.currentUserSubject = new BehaviorSubject<any>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/v1/auth/login`, { email, password })
      .pipe(
        tap(tokens => this.doLoginUser(email, tokens)),
        catchError(this.handleError)
      );
  }

  register(cedula: string, nombre: string, apellidos: string, telefono: string, email: string, password: string, rutaImagenPerfil?: string): Observable<string> {
    return this.http.post<any>(`http://localhost:8080/api/v1/auth/registro`, {cedula, nombre, apellidos, telefono, email, password, rutaImagenPerfil})
      .pipe(
        tap(message => console.log(message)),
        catchError(this.handleError)
      );
  }
  
  logout(): Observable<void>  {
    return of(undefined).pipe(
      tap(() => this.doLogoutUser())
    );
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  private doLoginUser(email: string, tokens: any) {
    this.storeTokens(tokens);
    this.currentUserSubject.next(email);
  }

  private doLogoutUser() {
    this.removeTokens();
    this.currentUserSubject.next(null);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: any) {
    localStorage.setItem(this.JWT_TOKEN, tokens.data);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`;
    } else {
      if (error.status === 500 && error.error.mensaje) {
        errorMessage = error.error.mensaje;
      } else {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}