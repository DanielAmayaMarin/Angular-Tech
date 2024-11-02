import { Inject, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ApiResponse, User } from "../../domain/models/user.model";
import { UsuariosRepositoryPort } from "../../domain/ports/usuarios-repository.port";


@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    constructor(@Inject('UsuariosRepositoryPort') private usuariosRepositoryPort: UsuariosRepositoryPort) {

    }

    getUsuarioId(): Observable<ApiResponse> {
        let email = localStorage.getItem('USER_EMAIL') || ""
        return this.usuariosRepositoryPort.getUsuarioId(email).pipe(
            catchError(this.handleError)
        )
    }

    getUsuarios(): Observable<ApiResponse>{
        return this.usuariosRepositoryPort.getUsuarios().pipe(
            catchError(this.handleError)
        )
    }

    editUsuario(user: User): Observable<ApiResponse>{
        return this.usuariosRepositoryPort.editUsuario(user).pipe(
            catchError(this.handleError)
        )
    }

    deleteUsuario(cedula: string): Observable<ApiResponse>{
        return this.usuariosRepositoryPort.deleteUsuario(cedula).pipe(
            catchError(this.handleError)
        )
    }


    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error(error.message || 'Server error'));
      }
}