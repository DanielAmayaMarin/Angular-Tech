import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { ConsumoEnergiaServer } from '../../../../core/application/use-cases/consumo-energia.service';
import { ApiResponse } from '../../../../core/domain/models/user.model';

interface ConsumoEnergia {
  continente: string;
  anio: number;
  mes: number;
  consumo_total: number;
  consumo_comercial: number;
  consumo_industrial: number;
  consumo_residencial: number;
  consumo_renovable: number;
}

@Component({
  selector: 'app-consumo-energetico',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './consumo-energetico.component.html',
})
export class ConsumoEnergeticoComponent implements OnInit{
  filtros = {
    anio: new Date().getFullYear(),
    continente: '',
    tipoConsumo: ''
  };

  datosCompletos: ConsumoEnergia[] = [];
  datosFiltrados: ConsumoEnergia[] = [];

  anios: number[] = [];
  continentes: string[] = [];
  tiposConsumo: string[] = [
    'consumo_total',
    'consumo_comercial',
    'consumo_industrial',
    'consumo_residencial',
    'consumo_renovable'
  ];

  chartOptions: { [key: string]: ApexOptions } = {
    consumoPorContinente: {
      series: [{
        name: 'Consumo Total',
        data: []
      }],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(2) + " TWh";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: [],
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
    },
    tendenciaConsumo: {
      series: [{
        name: "Consumo",
        
        data: []
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
        
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      },
    }
  };

  constructor(private consumoEnergiaServer:ConsumoEnergiaServer) { }

  ngOnInit(): void {
    this.aplicarFiltros();
    this.getConsumoEnergetico()
  }

  getConsumoEnergetico() {
    this.consumoEnergiaServer.getConsumoEnergetico().subscribe({
      next: (data: ApiResponse) => {
        this.datosCompletos = data.data.map((item: ConsumoEnergia) => ({
          continente: item.continente,
          anio: item.anio,
          mes: item.mes,
          consumo_total: item.consumo_total,
          consumo_comercial: item.consumo_comercial,
          consumo_industrial: item.consumo_industrial,
          consumo_residencial: item.consumo_residencial,
          consumo_renovable: item.consumo_renovable
        }));
        this.inicializarFiltros();
        this.aplicarFiltros();
      }
    });
  }

  inicializarFiltros() {
    this.anios = [...new Set(this.datosCompletos.map(item => item.anio))].sort((a, b) => b - a);
    this.continentes = ['Todos', ...new Set(this.datosCompletos.map(item => item.continente))].sort();
    this.filtros.anio = this.anios[0] || new Date().getFullYear();
    this.filtros.continente = 'Todos';
    this.filtros.tipoConsumo = 'consumo_total';
  }

  aplicarFiltros() {
    this.datosFiltrados = this.datosCompletos.filter(item => {
      const cumpleAnio = item.anio == this.filtros.anio;
      const cumpleContinente = this.filtros.continente === 'Todos' || 
                              item.continente === this.filtros.continente;
      return cumpleAnio && cumpleContinente;
    });
    
    this.actualizarGraficas();
  }

  actualizarGraficas() {
    this.actualizarGraficaConsumoPorContinente();
    this.actualizarGraficaTendenciaConsumo();
  }

  actualizarGraficaConsumoPorContinente() {
    const consumoPorContinente = this.datosFiltrados.reduce((acc, item) => {
      const valor = item[this.filtros.tipoConsumo as keyof ConsumoEnergia] as number;
      acc[item.continente] = (acc[item.continente] || 0) + valor;
      return acc;
    }, {} as Record<string, number>);
    let continentesAMostrar: string[];
    let datosAMostrar: number[];
    if (this.filtros.continente === 'Todos') {
      continentesAMostrar = Object.keys(consumoPorContinente).sort();
      datosAMostrar = continentesAMostrar.map(cont => 
        +(consumoPorContinente[cont] / 1000).toFixed(2)
      );
    } else {
      continentesAMostrar = [this.filtros.continente];
      datosAMostrar = [
        +(consumoPorContinente[this.filtros.continente] / 1000).toFixed(2)
      ];
    }
    this.chartOptions["consumoPorContinente"].series = [{
      name: this.obtenerNombreTipoConsumo(this.filtros.tipoConsumo),
      data: datosAMostrar
    }];
    this.chartOptions["consumoPorContinente"].xaxis!.categories = continentesAMostrar;
    this.chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
  }

  actualizarGraficaTendenciaConsumo() {
    const consumoPorMes = Array(12).fill(0);
    const contadorPorMes = Array(12).fill(0);
    this.datosFiltrados.forEach(item => {
      consumoPorMes[item.mes - 1] += item[this.filtros.tipoConsumo as keyof ConsumoEnergia] as number;
      contadorPorMes[item.mes - 1]++;
    });
    const promedioConsumo = consumoPorMes.map((total, index) => 
      contadorPorMes[index] ? (total / contadorPorMes[index]) / 1000 : 0
    );
    this.chartOptions["tendenciaConsumo"].series = [{
      name: this.obtenerNombreTipoConsumo(this.filtros.tipoConsumo),
      data: promedioConsumo
    }];
    this.chartOptions = { ...this.chartOptions };
  }

  obtenerNombreTipoConsumo(tipo: string): string {
    const nombres = {
      'consumo_total': 'Consumo Total',
      'consumo_comercial': 'Consumo Comercial',
      'consumo_industrial': 'Consumo Industrial',
      'consumo_residencial': 'Consumo Residencial',
      'consumo_renovable': 'Consumo Renovable'
    };
    return nombres[tipo as keyof typeof nombres] || tipo;
  }
}
