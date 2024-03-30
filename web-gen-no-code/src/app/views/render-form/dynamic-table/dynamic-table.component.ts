import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableModule } from '@coreui/angular';

@Component({
  standalone: true,
  imports: [CommonModule, TableModule],
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent {
  @Input() inputData: any[] = []; // Input data array
  @Output() onClick = new EventEmitter<any>();

  // Function to get object keys
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
