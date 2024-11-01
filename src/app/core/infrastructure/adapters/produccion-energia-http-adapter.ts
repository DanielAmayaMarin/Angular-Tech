import { Injectable } from "@angular/core";
import { ProduccionEnergiaRepositoryPort } from "../../domain/ports/produccion-energia-repository.port";
import { Observable } from "rxjs";
import { ApiResponse } from "../../domain/models/user.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn:"root"
})

export class ProduccionEnergiaHttpAdapter implements ProduccionEnergiaRepositoryPort {

    private apiUrl = 'http://localhost:8080/api/v1/';

    constructor(private http: HttpClient) {}


    getProduccionEnergetica(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}dashboard/produccion-por-energia`)
    }
    
}