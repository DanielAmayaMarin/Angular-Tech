import { Observable } from "rxjs";
import { ApiResponse } from "../models/user.model";



export interface PaisRepositoryPort {
    getPais(): Observable<ApiResponse>
}