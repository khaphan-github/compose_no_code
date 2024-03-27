import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CardModule,
  BadgeModule,
  TableModule,
  GridModule,
  ButtonModule,
  DropdownModule,
  ModalModule,
  FormCheckComponent,
  FormModule,
  AlertModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
 

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    CardModule,
    BadgeModule,
    TableModule,
    GridModule,
    ButtonModule,
    DropdownModule,
    ModalModule,
    FormCheckComponent,
    FormModule,
    ReactiveFormsModule,
    FormModule,
    AlertModule,
  ],
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  inputRequired!: FormGroup;
  
   
   
  @Input() item = '';
  ngOnInit() {}

  getValues(val: any) {
    console.log(val);
  }
  tableStructure = {
    tableName:"Account",
    columns: [
      { field: 'id', label: 'ID' },
      { field: 'name', label: 'Name' },
      { field: 'email', label: 'Email' },
      { field: 'address', label: 'Address' }

    ]
  };

  tableData = [
    { id: 1, name: 'loc1', email: 'loc1@example.com' ,address:"home1"},
    { id: 2, name: 'loc2', email: 'loc2@example.com' ,address:"home2"},
    { id: 3, name: 'loc3', email: 'loc3@example.com' ,address:"home3"},
    
  ];
}