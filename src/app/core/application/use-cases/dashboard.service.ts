import { Inject, Injectable } from "@angular/core";
import { DashboardRepositoryPort } from "../../domain/ports/dashboard-repository.port";
import { catchError, Observable, tap, throwError } from "rxjs";
import { ObtenerMetricasPrincipales } from "../../domain/models/dashboard-model";
import { ApiResponse } from "../../domain/models/user.model";


@Injectable({
    providedIn: 'root'
})

export class DashboardService {

    constructor(@Inject('DashboardRepositoryPort') private dashboardRepositoryPort: DashboardRepositoryPort) {

    }

    getProduccionTotalPorTipoYAnio(anio:number): Observable<ApiResponse>{
        return this.dashboardRepositoryPort.getProduccionTotalPorTipoYAnio(anio).pipe(
            catchError(this.handleError)
        )
    }

    getFuentesDeEnergiaRenovable(): Observable<ApiResponse>{
        return this.dashboardRepositoryPort.getFuentesDeEnergiaRenovable().pipe(
            catchError(this.handleError)
        )
    }


    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error(error.message || 'Server error'));
    }

}