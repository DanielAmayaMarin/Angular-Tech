import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-produccion-energia',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './produccion-energia.component.html',
})
export class ProduccionEnergiaComponent implements OnInit {

  filtros = {
    anio: new Date().getFullYear(),
    pais: '',
    tipoEnergia: ''
  };

  anios = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);
  paises = ['España', 'Francia', 'Alemania', 'Italia', 'Portugal'];
  tiposEnergia = ['Solar', 'Eólica', 'Hidroeléctrica', 'Biomasa', 'Geotérmica'];

  chartOptions: { [key: string]: ApexOptions } = {
    produccionPorTipo: {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'pie',
        height: 350
      },
      labels: this.tiposEnergia,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex].toFixed() + ' GWh'
        },
      },
      legend: {
        position: 'bottom'
      }
    },
    tendenciaProduccion: {
      series: [{
        name: "Producción Total",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
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
    // Aquí iría la lógica para actualizar los datos de las gráficas
    // basándose en los filtros seleccionados
    console.log('Filtros aplicados:', this.filtros);
    // Simulación de actualización de datos
    this.actualizarGraficas();
  }

  actualizarGraficas() {
    // Simulación de actualización de datos para las gráficas
    this.chartOptions['produccionPorTipo'].series = [
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100
    ];
    
    this.chartOptions['tendenciaProduccion'].series = [{
      name: "Producción Total",
      data: Array.from({length: 9}, () => Math.floor(Math.random() * 100) + 20)
    }];
    
    // Forzar la actualización de las gráficas
    this.chartOptions = {...this.chartOptions};
  }
  
}
