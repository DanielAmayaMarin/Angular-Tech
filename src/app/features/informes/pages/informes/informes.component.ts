import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { ReportFilters } from '../../../../core/domain/models/user.model';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './informes.component.html',
})
export class InformesComponent implements OnInit {

  filters: ReportFilters = {
    startDate: '',
    endDate: '',
    tipoInforme: 'consumo',
    continente: '',
    pais: '',
    tipoEnergia: ''
  };

  continentes = ['Europa', 'América', 'Asia', 'África', 'Oceanía'];
  paises = ['España', 'Francia', 'Alemania', 'Italia', 'Portugal'];
  tiposEnergia = ['Solar', 'Eólica', 'Hidroeléctrica', 'Biomasa', 'Geotérmica'];
  
  tableHeaders: string[] = [];
  tableData: any[][] = [];

  chartOptions: { [key: string]: ApexOptions } = {
    mainChart: {
      series: [{
        name: 'Consumo',
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
    },
    pieChart: {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'pie',
        height: 350
      },
      labels: ['Solar', 'Eólica', 'Hidroeléctrica', 'Biomasa', 'Geotérmica'],
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
        enabled: true
      }
    }
  };

  constructor() { (window as any).jsPDF = jsPDF; }

  ngOnInit(): void {
    this.updateReport();
  }

  updateReport() {
    console.log('Actualizando informe con filtros:', this.filters);
    this.updateCharts();
    this.updateTable();
  }

  updateCharts() {
    this.chartOptions['mainChart'].series = [{
      name: this.filters.tipoInforme === 'consumo' ? 'Consumo' : 'Producción',
      data: Array.from({length: 9}, () => Math.floor(Math.random() * 100) + 20)
    }];

    this.chartOptions['pieChart'].series = [
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100
    ];
    this.chartOptions = {...this.chartOptions};
  }

  updateTable() {
    switch(this.filters.tipoInforme) {
      case 'consumo':
        this.tableHeaders = ['País', 'Consumo Total', 'Consumo Mensual', 'Media'];
        break;
      case 'produccion':
        this.tableHeaders = ['Tipo', 'Producción Total', 'Eficiencia', 'Tendencia'];
        break;
      case 'balance':
        this.tableHeaders = ['Región', 'Producción', 'Consumo', 'Balance'];
        break;
      case 'tendencias':
        this.tableHeaders = ['Período', 'Producción', 'Consumo', 'Variación'];
        break;
    }

    this.tableData = Array.from({length: 5}, () => 
      Array.from({length: this.tableHeaders.length}, () => 
        Math.floor(Math.random() * 1000)
      )
    );
  }

  getChartTitle(): string {
    switch(this.filters.tipoInforme) {
      case 'consumo': return 'Tendencia de Consumo';
      case 'produccion': return 'Tendencia de Producción';
      case 'balance': return 'Balance Energético';
      case 'tendencias': return 'Tendencias Mensuales';
      default: return 'Análisis Energético';
    
    }
  }

  async exportPDF() {
    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Configuración inicial
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Añadir título
      doc.setFontSize(18);
      doc.text('Informe Energético', pageWidth / 2, 15, { align: 'center' });
      
      // Añadir información de filtros
      doc.setFontSize(11);
      doc.text(`Tipo de Informe: ${this.filters.tipoInforme}`, 14, 25);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 32);
      if (this.filters.continente) {
        doc.text(`Continente: ${this.filters.continente}`, 14, 39);
      }
      if (this.filters.pais) {
        doc.text(`País: ${this.filters.pais}`, 14, 46);
      }

      // Configurar y añadir tabla
      autoTable(doc, {
        head: [this.tableHeaders],
        body: this.tableData,
        startY: 55,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
        },
        margin: { top: 10 },
        didDrawPage: (data: any) => {
          // Añadir número de página en cada página
          doc.setFontSize(10);
          doc.text(
            `Página ${doc.getCurrentPageInfo().pageNumber}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
        }
      });

      // Obtener el número total de páginas
      const pageInfo = doc.getCurrentPageInfo();
      const totalPages = pageInfo.pageNumber;

      // Actualizar los números de página con el total
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Generar nombre del archivo
      const fileName = `Informe_Energetico_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Guardar el PDF
      doc.save(fileName);

    } catch (error) {
      console.error('Error al exportar PDF:', error);
      // Aquí podrías implementar un servicio de notificación para mostrar el error al usuario
      // Por ejemplo:
      // this.notificationService.showError('Error al exportar el PDF. Por favor, intente nuevamente.');
    }
  }
  exportExcel() {
    try {
      // Preparar los datos para Excel
      const workbook = XLSX.utils.book_new();
      
      // Crear hoja de datos principales
      const wsData = [
        this.tableHeaders,
        ...this.tableData
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);

      // Añadir hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Principales');

      // Crear hoja de resumen
      const summaryData = [
        ['Resumen del Informe'],
        ['Fecha', new Date().toLocaleDateString()],
        ['Tipo de Informe', this.filters.tipoInforme],
        ['Continente', this.filters.continente || 'Todos'],
        ['País', this.filters.pais || 'Todos'],
        ['Tipo de Energía', this.filters.tipoEnergia || 'Todos'],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

      // Añadir hoja de resumen al libro
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

      // Aplicar estilos (ancho de columnas)
      const wscols = [
        {wch: 20}, // A
        {wch: 15}, // B
        {wch: 15}, // C
        {wch: 15}, // D
      ];
      worksheet['!cols'] = wscols;
      summarySheet['!cols'] = wscols;

      // Generar el archivo
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      // Crear Blob y guardar archivo
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
      const fileName = `Informe_Energetico_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  // Función auxiliar para formatear números
  private formatNumber(num: number): string {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(num);
  }
  
}
