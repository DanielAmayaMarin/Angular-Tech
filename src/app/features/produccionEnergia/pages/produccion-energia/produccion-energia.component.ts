import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { ProduccionEnergiaService } from '../../../../core/application/use-cases/produccion-energia.service';
import { ApiResponse } from '../../../../core/domain/models/user.model';

interface ProduccionEnergia {
  anio: number;
  pais: string;
  mes: number;
  produccion: number;
  tipoEnergia: string;
}

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
    //tiposEnergia: [] as string[]
  };

  datosCompletos: ProduccionEnergia[] = [];
  datosFiltrados: ProduccionEnergia[] = [];

  anios: number[] = [];
  paises: string[] = [];
  tiposEnergia: string[] = [];

  chartOptions: { [key: string]: ApexOptions } = {
    produccionPorTipo: {
      series: [1],
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: true
        }
      },
      labels: ['Cargando...'],
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
          return opts.w.config.series[opts.seriesIndex].toFixed(2) + ' GWh'
        },
      },
      legend: {
        position: 'bottom'
      },
      noData: {
        text: 'Cargando datos...',
        align: 'center',
        verticalAlign: 'middle'
      }
    },
    tendenciaProduccion: {
      series: [{
        name: "Producción Total",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2
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
      noData: {
        text: 'Cargando datos...',
        align: 'center',
        verticalAlign: 'middle'
      }
    }
  };

  constructor(private produccionEnergiaService: ProduccionEnergiaService) { }

  ngOnInit(): void {
    this.getProduccionEnergetica();
  }

  getProduccionEnergetica() {
    this.produccionEnergiaService.getProduccionEnergetica().subscribe({
      next: (data: ApiResponse) => {
        this.datosCompletos = data.data.map((item: ProduccionEnergia) => ({
          anio: item.anio,
          pais: item.pais,
          mes: item.mes,
          produccion: item.produccion,
          tipoEnergia: item.tipoEnergia
        }));
        this.inicializarFiltros();
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
      }
    });
  }

  inicializarFiltros() {
    this.anios = [...new Set(this.datosCompletos.map(item => item.anio))].sort((a, b) => b - a);
    this.paises = [ ...new Set(this.datosCompletos.map(item => item.pais))].sort();
    this.tiposEnergia = [ ...new Set(this.datosCompletos.map(item => item.tipoEnergia))].sort();
    this.filtros.anio = this.anios[0] || new Date().getFullYear();
    this.filtros.pais = 'Colombia';
    //this.filtros.tiposEnergia = [];
    this.filtros.tipoEnergia = '';

  }

  aplicarFiltros() {
    this.datosFiltrados = this.datosCompletos.filter(item => {
      const cumpleAnio = item.anio == this.filtros.anio;
      const cumplePais = this.filtros.pais === 'Colombia' || item.pais == this.filtros.pais;
      const cumpleTipoEnergia = this.filtros.tipoEnergia == '' || item.tipoEnergia == this.filtros.tipoEnergia;
      return cumpleAnio && cumplePais && cumpleTipoEnergia;
    });
    this.actualizarGraficas();
  }

    /*aplicarFiltros() {
      this.datosFiltrados = this.datosCompletos.filter(item => {
        const cumpleAnio = item.anio == this.filtros.anio;
        const cumplePais = this.filtros.pais === 'Colombia' || item.pais == this.filtros.pais;
        const cumpleTipoEnergia = this.filtros.tiposEnergia.length === 0 || this.filtros.tiposEnergia.includes(item.tipoEnergia);
        return cumpleAnio && cumplePais && cumpleTipoEnergia;
      });
      this.actualizarGraficas();
    }*/

  actualizarGraficas() {
    if (this.datosFiltrados.length === 0) {
      this.chartOptions["produccionPorTipo"].series = [0];
      this.chartOptions["produccionPorTipo"].labels = ['Sin datos'];
      this.chartOptions["tendenciaProduccion"].series = [{
        name: "Producción Total",
        data: Array(12).fill(0)
      }];
    } else {
      const produccionPorTipo = this.datosFiltrados.reduce((acc, item) => {
        acc[item.tipoEnergia] = (acc[item.tipoEnergia] || 0) + item.produccion;
        return acc;
      }, {} as {[key: string]: number});

      this.chartOptions["produccionPorTipo"].series = Object.values(produccionPorTipo);
      this.chartOptions["produccionPorTipo"].labels = Object.keys(produccionPorTipo);
      const produccionPorMes = Array(12).fill(0);
      this.datosFiltrados.forEach(item => {
        produccionPorMes[item.mes - 1] += item.produccion;
      });

      this.chartOptions["tendenciaProduccion"].series = [{
        name: "Producción Total",
        data: produccionPorMes
      }];
    }
    this.chartOptions = {
      ...this.chartOptions,
      produccionPorTipo: { ...this.chartOptions["produccionPorTipo"] },
      tendenciaProduccion: { ...this.chartOptions["tendenciaProduccion"] }
    };
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  /*toggleTipoEnergia(tipoEnergia: string) {
    const index = this.filtros.tiposEnergia.indexOf(tipoEnergia);
    if (index > -1) {
      this.filtros.tiposEnergia.splice(index, 1);
    } else {
      this.filtros.tiposEnergia.push(tipoEnergia);
    }
    this.aplicarFiltros();
  }*/
}