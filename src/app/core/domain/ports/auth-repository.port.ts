import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface AuthRepositoryPort {
  login(email: string, password: string): Observable<string>;
  register(user: Omit<User, 'id'>): Observable<string>;
  getCurrentUser(email:string): Observable<User | null>;
}