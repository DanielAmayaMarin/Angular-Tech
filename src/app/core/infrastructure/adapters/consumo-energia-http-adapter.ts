import { Injectable } from "@angular/core";
import { ConsumoEnergiaRepositoryPort } from "../../domain/ports/consumo-energia-repository.port";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../../domain/models/user.model";



@Injectable({
    providedIn:'root'
})
export class ConsumoEnergiaHttpAdapter implements ConsumoEnergiaRepositoryPort {

    private apiUrl = 'http://localhost:8080/api/v1/';

    constructor(private http: HttpClient) {}

    getConsumoEnergetico(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}dashboard/consumo-energetico`)
    }

}