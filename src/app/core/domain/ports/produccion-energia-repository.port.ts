import { Observable } from "rxjs";
import { ApiResponse } from "../models/user.model";

export interface ProduccionEnergiaRepositoryPort {
    getProduccionEnergetica():Observable<ApiResponse>
}