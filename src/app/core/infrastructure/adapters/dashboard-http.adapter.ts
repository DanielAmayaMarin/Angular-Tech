import { Injectable } from "@angular/core";
import { DashboardRepositoryPort } from "../../domain/ports/dashboard-repository.port";
import { Observable } from "rxjs";
import { ObtenerMetricasPrincipales } from "../../domain/models/dashboard-model";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../../domain/models/user.model";

@Injectable({
    providedIn:'root'
})

export class DashboardHttpAdapter implements DashboardRepositoryPort{

    private apiUrl = 'http://localhost:8080/api/v1/';

    constructor(private http: HttpClient) {}

    getEnergiasRenovablesPorRegion(anio: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}dashboard/energias-renovables-por-region/${anio}`)
    }
    
    getFuentesDeEnergiaRenovable(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}dashboard/fuentes-de-energia-renovable`)
    }

    getProduccionTotalPorTipoYAnio(anio: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}dashboard/obtener-metricas-principales/${anio}`)
    }

}