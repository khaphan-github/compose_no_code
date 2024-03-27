import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AlertModule,
  BadgeModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormCheckComponent,
  FormModule,
  GridModule,
  ModalModule,
  TableModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface DynamicField {
  fieldId: string;
  inputUI: string;
  datatype: string;
  required: boolean;
  maxLength: number;
  minLength: number;
  displayText: string;
}

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
    FormsModule,
    AlertModule,
  ],
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  currentItem = 'Television';
  inputRequired!: FormGroup;
  jsonData = {
    
    title: 'Generate',
    fields: [
       { inputUi: 'input', datatype: '', name:"Id", required: false, maxlength: 256, minlength: 0, displaytext: " ID" },
      { inputUi: 'input', datatype: '', name:"name",required: false, maxlength: 256, minlength: 0, displaytext: "Name" },
      { inputUi: 'input', datatype: '', name:"Email",required: false, maxlength: 256, minlength: 0, displaytext: "Email" },
      { inputUi: 'input', datatype: '', name:"Address",required: false, maxlength: 256, minlength: 0, displaytext: "Address" },
  
    ]
  };

  ngOnInit() {
 
  }
   
  getValues(val: any){
    console.log(val)
  }
  getErrorMessage(fieldName: string): string {
    const field = this.jsonData.fields.find((f) => f.displaytext === fieldName);
    if (field && field.required) {
      return `${field.displaytext} là trường bắt buộc`;
    }
    return '';
  }
}