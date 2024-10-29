import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="alert" [ngClass]="{'alert-danger': type === 'error', 'alert-success': type === 'success'}">
      <span>{{ message }}</span>
      <button (click)="close()" class="close-btn">&times;</button>
    </div>
  `,
  styles: [`
    .alert {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 4px;
    }
    .alert-danger {
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }
    .alert-success {
      color: #155724;
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
    .close-btn {
      float: right;
      font-size: 20px;
      font-weight: bold;
      line-height: 20px;
      color: #000;
      text-shadow: 0 1px 0 #fff;
      opacity: .2;
      background: none;
      border: none;
      cursor: pointer;
    }
  `]
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'error' | 'success' = 'error';
  @Input() isVisible: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.isVisible = false;
    this.closed.emit();
  }
}