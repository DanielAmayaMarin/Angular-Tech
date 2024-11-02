import { Injectable } from "@angular/core";
import { PaisRepositoryPort } from "../../domain/ports/pais-repository.port";
import { Observable } from "rxjs";
import { ApiResponse } from "../../domain/models/user.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})

export class PaisHttpAdapter implements PaisRepositoryPort {

    private apiUrl = 'http://localhost:8080/api/v1/';

    constructor(private http: HttpClient) {}

    getPais(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}paises`)
    }

}