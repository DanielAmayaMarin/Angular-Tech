import { Inject, Injectable } from "@angular/core";
import { PaisRepositoryPort } from "../../domain/ports/pais-repository.port";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "../../domain/models/user.model";


@Injectable({
    providedIn: 'root'
})
export class PaisService {

    constructor(@Inject('PaisRepositoryPort') private paisRepositoryPort: PaisRepositoryPort) {

    }

    getPais(): Observable<ApiResponse> {
        return this.paisRepositoryPort.getPais().pipe(
            catchError(this.handleError)
        )
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error(error.message || 'Server error'));
    }
}