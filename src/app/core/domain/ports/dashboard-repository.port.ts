import { Observable } from "rxjs";
import { ApiResponse } from "../models/user.model";

export interface DashboardRepositoryPort {
    getProduccionTotalPorTipoYAnio(anio: number):Observable<ApiResponse>
    getFuentesDeEnergiaRenovable():Observable<ApiResponse>
    getEnergiasRenovablesPorRegion(anio: number): Observable<ApiResponse>
}