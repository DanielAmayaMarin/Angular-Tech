import { Component, OnInit } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { NgApexchartsModule } from "ng-apexcharts";
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../core/application/use-cases/dashboard.service';
import { ObtenerMetricasPrincipales, RenewableSource } from '../../../../core/domain/models/dashboard-model';
import { ApiResponse } from '../../../../core/domain/models/user.model';

interface Card {
  title: string;
  value: string;
  color: string;
  icon: string;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  produccionTotalPorTipoYAnio: ObtenerMetricasPrincipales = {
    produccion_total: 0,
    consumo_total: 0,
    eficiencia: 0
  };

  constructor(private dashboardService: DashboardService) { }


  cards: Card[] = [];

  productionVsConsumptionChartOptions: ApexOptions = {
    series: [
      { name: 'Producción', data: [31, 40, 28, 51, 42, 109, 100] },
      { name: 'Consumo', data: [11, 32, 45, 32, 34, 52, 41] }
    ],
    chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-10-19T00:00:00.000Z',
        '2018-11-20T00:00:00.000Z',
        '2018-12-21T00:00:00.000Z',
        '2018-01-22T00:00:00.000Z',
        '2018-02-23T00:00:00.000Z',
        '2018-03-24T00:00:00.000Z',
        '2018-04-25T00:00:00.000Z'
      ]
    },
    colors: ['#10B981', '#3B82F6']
  };

  renewableSourcesChartOptions: ApexOptions = {
    series: [44, 55, 13, 30],
    chart: {
      type: 'donut',
      height: 350
    },
    labels: ['Solar', 'Eólica', 'Hidroeléctrica', 'Biomasa'],
    colors: ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'],
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
    }]
  };

  getProduccionTotalPorTipoYAnio() {
    const year = new Date().getFullYear().toString();
    this.dashboardService.getProduccionTotalPorTipoYAnio(parseInt(year)).subscribe({
      next: (data: ApiResponse) => {
        this.produccionTotalPorTipoYAnio = data.data;
        this.updateCards(data.data);
      }
    });
  }


  fuentesDeEnergiaRenovable() {
    this.dashboardService.getFuentesDeEnergiaRenovable().subscribe(
      (data: ApiResponse) => {
        if (data.codigo === 200 && Array.isArray(data.data)) {
          const topSources = this.getTopRenewableSources(data.data, 10);
          this.updateRenewableSourcesChart(topSources);
        }
      }
    );
  }


  getTopRenewableSources(data: any[], count: number): RenewableSource[] {
    return data
      .map(([name, value, percentage]) => ({ name, value, percentage }))
      .sort((a, b) => b.value - a.value)
      .slice(0, count);
  }

  updateRenewableSourcesChart(sources: RenewableSource[]) {
    this.renewableSourcesChartOptions.series = sources.map(s => s.value);
    this.renewableSourcesChartOptions.labels = sources.map(s => s.name);
    this.renewableSourcesChartOptions.colors = [
      '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'
    ];
    
    this.renewableSourcesChartOptions = { ...this.renewableSourcesChartOptions };
  }


  updateCards(data: ObtenerMetricasPrincipales) {
    this.cards = [
      { title: 'Producción Total', value: `${data.produccion_total?.toFixed(2) ?? '0'} GWh`, color: 'green', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { title: 'Consumo Total', value: `${data.consumo_total?.toFixed(2) ?? '0'} GWh`, color: 'blue', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { title: 'Eficiencia Energética', value: `${(data.eficiencia ? data.eficiencia * 100 : 0).toFixed(1)}%`, color: 'teal', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { title: 'Ahorro de CO2', value: `${((data.produccion_total ?? 0) - (data.consumo_total ?? 0)).toFixed(2)} Tn`, color: 'orange', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
    ];
  }



  ngOnInit(): void {
    this.getProduccionTotalPorTipoYAnio();
    this.fuentesDeEnergiaRenovable()
  }
}