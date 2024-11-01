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

  renewableSourcesChartOptions: ApexOptions = {
    series: [1],
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


  renewableEnergyChartOptions: ApexOptions = {
    series: [{
      name: "Porcentaje de Energía Renovable",
      data: []
    }],
    chart: {
      type: "bar",
      height: 400,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: ['North America','Antarctica','Africa','Asia','Oceania','South America','Europe'],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + "%";
        }
      }
    },
    theme: {
      mode: 'light',
      palette: 'palette1'
    }
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

  getRenewableEnergyByRegion() {
    const year = new Date().getFullYear().toString();
    this.dashboardService.getEnergiasRenovablesPorRegion(parseInt(year)).subscribe(
      (data: ApiResponse) => {
        if (data.codigo === 200 && Array.isArray(data.data)) {
          this.updateRenewableEnergyChart(data.data);
        }
      }
    );
  }

  updateRenewableEnergyChart(data: any[]) {
    const regions = data.map(item => item.region);
    const percentages = data.map(item => item.porcentaje_renovable);

    this.renewableEnergyChartOptions.xaxis!.categories = regions;
    this.renewableEnergyChartOptions.series = [{
      name: "Porcentaje de Energía Renovable",
      data: percentages
    }];

    this.renewableEnergyChartOptions = { ...this.renewableEnergyChartOptions };
  }



  ngOnInit(): void {
    this.getProduccionTotalPorTipoYAnio();
    this.fuentesDeEnergiaRenovable()
    this.getRenewableEnergyByRegion();
  }
}