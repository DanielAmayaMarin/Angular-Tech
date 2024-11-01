export interface ObtenerMetricasPrincipales {
    produccion_total: number,
    consumo_total: number,
    eficiencia: number
}

export interface RenewableSource {
    name: string;
    value: number;
    percentage: number;
  }