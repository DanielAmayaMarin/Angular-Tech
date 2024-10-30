import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port';
import { User } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpAdapter implements AuthRepositoryPort {
  private apiUrl = 'http://localhost:8080/api/v1/';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}auth/login`, { email, password });
  }

  register(user: Omit<User, 'id'>): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}auth/registro`, user);
  }


  getCurrentUser(email:string): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}usuarios/${email}`);
  }
}