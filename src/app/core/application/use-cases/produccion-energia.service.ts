import { Inject, Injectable } from "@angular/core";
import { ProduccionEnergiaRepositoryPort } from "../../domain/ports/produccion-energia-repository.port";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "../../domain/models/user.model";


@Injectable({
    providedIn: 'root'
})
export class ProduccionEnergiaService {

    constructor(@Inject('ProduccionEnergiaRepositoryPort') private usuariosRepositoryPort: ProduccionEnergiaRepositoryPort) {

    }

    getProduccionEnergetica(): Observable<ApiResponse> {
        return this.usuariosRepositoryPort.getProduccionEnergetica().pipe(
            catchError(this.handleError)
        )
    }


    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error(error.message || 'Server error'));
    }
}