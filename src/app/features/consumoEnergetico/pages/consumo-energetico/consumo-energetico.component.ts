import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

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

  anios = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);
  continentes = ['Europa', 'América', 'Asia', 'África', 'Oceanía'];
  tiposConsumo = ['Residencial', 'Industrial', 'Comercial', 'Transporte', 'Otros'];

  chartOptions: { [key: string]: ApexOptions } = {
    consumoPorContinente: {
      series: [{
        name: 'Consumo Total',
        data: [2.3, 3.1, 4.0, 10.1, 4.0]
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
        formatter: function (val:number) {
          return val.toFixed() + " TWh";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: this.continentes,
        position: 'top',
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
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
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
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
      }
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    console.log('Filtros aplicados:', this.filtros);
    this.actualizarGraficas();
  }

  actualizarGraficas() {
    this.chartOptions['consumoPorContinente'].series = [{
      name: 'Consumo Total',
      data: this.continentes.map(() => Math.random() * 10 + 1)
    }];
    
    this.chartOptions['tendenciaConsumo'].series = [{
      name: "Consumo",
      data: Array.from({length: 9}, () => Math.floor(Math.random() * 100) + 20)
    }];
    
    this.chartOptions = {...this.chartOptions};
  }
  
}
