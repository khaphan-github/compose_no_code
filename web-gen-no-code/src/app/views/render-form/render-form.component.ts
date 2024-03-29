import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
interface TableRow {
  id: number;
  name: string;
  email: string;
  address: string;
}

interface TableColumn {
  field: keyof TableRow;
  label: string;
}
@Component({
  selector: 'app-render-form',
  templateUrl: './render-form.component.html',
  styleUrls: ['./render-form.component.css'],
})
export class RenderFormComponent implements OnInit {
  constructor(
    private modal: NgbModal
  ) {}

  ngOnInit() {
     
  }
 
  update( ) {
    const modalRef = this.modal.open(UpdateComponent, {
      size: 'lg',
    });
     
  }

  onCreate() {
    const modalRef = this.modal.open(CreateComponent, {
      size: 'lg',
    });
  
  }
  tableStructure = {
    tableName: "Account",
    columns: [
      { field: 'id', label: 'ID' },
      { field: 'name', label: 'Name' },
      { field: 'email', label: 'Email' },
      { field: 'address', label: 'Address' }
    ] as TableColumn[]
  };

  tableData: TableRow[] = [
    { id: 1, name: 'loc1', email: 'loc1@gmail.com', address: "home1" },
    { id: 2, name: 'loc2', email: 'loc2@gmail.com', address: "home2" },
    { id: 3, name: 'loc3', email: 'loc3@gmail.com', address: "home3" }
  ];
  
}
