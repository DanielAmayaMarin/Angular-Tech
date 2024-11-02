import { HttpClient } from "@angular/common/http";
import { UsuariosRepositoryPort } from "../../domain/ports/usuarios-repository.port";
import { Observable } from "rxjs";
import { ApiResponse, User } from "../../domain/models/user.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UsuariosHttpAdapter implements UsuariosRepositoryPort {

    private apiUrl = 'http://localhost:8080/api/v1/';

    constructor(private http: HttpClient) {}
    
    getUsuarioId(email: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}usuarios/${email}`)
    }

    deleteUsuario(cedula: string): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.apiUrl}usuarios/${cedula}`)
    }

    editUsuario(user: User): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.apiUrl}usuarios/${user.cedula}`, user)
    }

    getUsuarios(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}usuarios`)
    }

    
}