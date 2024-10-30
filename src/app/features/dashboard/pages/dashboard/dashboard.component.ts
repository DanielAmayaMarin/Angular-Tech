import { Component, OnInit } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { NgApexchartsModule } from "ng-apexcharts";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit  {
  cards = [
    { title: 'Producción Total', value: '634.89 GWh', color: 'green', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Consumo Total', value: '589.24 GWh', color: 'blue', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Eficiencia Energética', value: '92.8%', color: 'teal', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Ahorro de CO2', value: '376.5 toneladas', color: 'orange', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

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
        '2018-09-19T00:00:00.000Z',
        '2018-09-20T00:00:00.000Z',
        '2018-09-21T00:00:00.000Z',
        '2018-09-22T00:00:00.000Z',
        '2018-09-23T00:00:00.000Z',
        '2018-09-24T00:00:00.000Z',
        '2018-09-25T00:00:00.000Z'
      ]
    },
    colors: ['#10B981', '#3B82F6']
  };

  renewableSourcesChartOptions: ApexOptions = {
    series: [44, 55, 13, 43],
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

  constructor() { }

  ngOnInit(): void {
  }
}