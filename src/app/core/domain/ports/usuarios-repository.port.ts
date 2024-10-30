import { Observable } from "rxjs";
import { ApiResponse, User } from "../models/user.model";

export interface UsuariosRepositoryPort {
    getUsuarios(): Observable<ApiResponse>
    editUsuario(user: User): Observable<ApiResponse>
}