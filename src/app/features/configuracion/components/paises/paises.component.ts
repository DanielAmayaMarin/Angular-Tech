import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pais } from '../../../../core/domain/models/user.model';
import { PaisService } from '../../../../core/application/use-cases/pais.service';

@Component({
  selector: 'app-paises',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './paises.component.html'
})
export class PaisesComponent implements OnInit {
  paises: Pais[] = [];
  filteredPaises: Pais[] = [];
  searchTerm: string = '';
  sortColumn: keyof Pais = 'nombre';
  sortDirection: 'asc' | 'desc' = 'asc';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  math = Math;

  constructor(private paisService: PaisService) {}

  ngOnInit() {
    this.loadPais();
  }

  loadPais() {
    this.paisService.getPais().subscribe({
      next: (data) => {
        this.paises = data.data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar países', error);
      }
    });
  }

  applyFilters() {
    this.filteredPaises = this.paises.filter(pais =>
      pais.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pais.continente.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortData();
  }

  sortData() {
    if (this.sortColumn) {
      this.filteredPaises.sort((a, b) => {
        const aValue = a[this.sortColumn];
        const bValue = b[this.sortColumn];
        const compareResult = typeof aValue === 'string' 
          ? (aValue as string).localeCompare(bValue as string)
          : (aValue as number) - (bValue as number);
        return this.sortDirection === 'asc' ? compareResult : -compareResult;
      });
    }
  }

  onSort(column: keyof Pais) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  get pagedPaises() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPaises.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredPaises.length / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  getCurrentRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredPaises.length);
    return { start, end };
  }
}