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

    editUsuario(user: User): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.apiUrl}usuarios/${user.cedula}`, user)
    }

    getUsuarios(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}usuarios`)
    }

    
}