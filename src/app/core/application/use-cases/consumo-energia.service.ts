import { Inject, Injectable } from "@angular/core";
import { ConsumoEnergiaRepositoryPort } from "../../domain/ports/consumo-energia-repository.port";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "../../domain/models/user.model";


@Injectable({
    providedIn: 'root'
})

export class ConsumoEnergiaServer {

    constructor(@Inject('ConsumoEnergiaRepositoryPort') private consumoEnergiaRepositoryPort: ConsumoEnergiaRepositoryPort) {

    }

    getConsumoEnergetico(): Observable<ApiResponse> {
        return this.consumoEnergiaRepositoryPort.getConsumoEnergetico().pipe(
            catchError(this.handleError)
        )
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error(error.message || 'Server error'));
    }

}