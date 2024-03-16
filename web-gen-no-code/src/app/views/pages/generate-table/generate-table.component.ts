import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageApiService } from '../../manage-auth/services/manage-api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-table',
  templateUrl: './generate-table.component.html',
  styleUrls: ['./generate-table.component.scss'],
})
export class GenerateTableComponent implements OnInit {
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
