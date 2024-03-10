import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageApiService } from '../../manage-auth/services/manage-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-form',
  templateUrl: "./generate-form.component.html",
  styleUrls: ['./generate-form.component.scss']
}) 
export class GenerateFormComponent implements OnInit {

  inputRequired!: FormGroup;
  jsonData = {
    
    title: 'Generate',
    fields: [
      { inputUi: 'input', datatype: '', name:"id",required: false, maxlength: 256, minlength: 0, displaytext: "Id" },
      { inputUi: 'input', datatype: '', name:"ClassId", required: false, maxlength: 256, minlength: 0, displaytext: "Class ID" },
      { inputUi: 'input', datatype: '', name:"BeginAt",required: false, maxlength: 256, minlength: 0, displaytext: "Begin At" },
      { inputUi: 'input', datatype: '', name:"EndAt",required: false, maxlength: 256, minlength: 0, displaytext: "End At" },
      { inputUi: 'input', datatype: '', name:"Metadata",required: false, maxlength: 256, minlength: 0, displaytext: "Metadata" },
      { inputUi: 'input', datatype: '', name:"CreateAt", required: false, maxlength: 256, minlength: 0, displaytext: "Create At" }
    ]
  };

  ngOnInit() {
 
  }

  
  getErrorMessage(fieldName: string): string {
    const field = this.jsonData.fields.find((f) => f.displaytext === fieldName);
    if (field && field.required) {
      return `${field.displaytext} là trường bắt buộc`;
    }
    return '';
  }
}
