import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthRepositoryPort } from '../../domain/ports/auth-repository.port';
import { User } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_EMAIL = 'USER_EMAIL';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(@Inject('AuthRepositoryPort') private authRepository: AuthRepositoryPort) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  initialize(): void {
    console.log("initialize")
    this.loadStoredUser();
  }

  login(email: string, password: string): Observable<string> {
    return this.authRepository.login(email, password).pipe(
      tap(tokens => this.handleAuthentication(tokens)),
      catchError(this.handleError)
    );
  }

  register(user: Omit<User, 'id'>): Observable<string> {
    return this.authRepository.register(user).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return of(undefined).pipe(
      tap(() => this.doLogoutUser())
    );
  }

  getCurrentUser(): Observable<User | null> {
    const email = localStorage.getItem(this.USER_EMAIL);
    
    if (!email) {
      console.warn('No user email found in localStorage');
      return of(null);
    }

    return this.authRepository.getCurrentUser(email).pipe(
      catchError(error => {
        return throwError(() => new Error('Error fetching user data: ' + error.message));
      })
    );
  }

  getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  private loadStoredUser(): void {
    if (this.isLoggedIn()) {
      this.getCurrentUser().subscribe(
        user => this.currentUserSubject.next(user),
        error => console.error('Error loading stored user:', error)
      );
    }
  }

  private doLogoutUser() {
    this.removeTokens();
    this.currentUserSubject.next(null);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_EMAIL);
  }

  private handleAuthentication(tokens: any): void {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.USER_EMAIL, tokens.email);
    this.getCurrentUser().subscribe(
      user => this.currentUserSubject.next(user),
      error => console.error('Error fetching user after authentication:', error)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}