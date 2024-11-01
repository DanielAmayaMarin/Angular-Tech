import { Observable } from "rxjs";
import { ApiResponse } from "../models/user.model";


export interface ConsumoEnergiaRepositoryPort {
    getConsumoEnergetico():Observable<ApiResponse>
}