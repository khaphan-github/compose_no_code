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
  @Input() formInfo!: any;
  @Output() onSummit = new EventEmitter<any>();
  dynamicForm!: FormGroup;

  error: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private activeModel: NgbActiveModal
  ) {}

  ngOnInit() {
    const formControls: any = {};
    this.formInfo.fields.forEach((field: any) => {
      if (field.fieldId !== 'id') {
        formControls[field.fieldId] = [
          '',
          field.required ? Validators.required : null,
        ];
      }
    });
    this.dynamicForm = this.fb.group(formControls);
  }

  onSubmit() {
    this.error = false;
    const body: any[] = [this.dynamicForm.value];

    this.httpClient
      .post<SResponse<Array<any>>>(
        apiPathBuilder(`/${this.formInfo.metadata.table_name}`),
        body
      )
      .subscribe({
        next: (value) => {
          if (value) {
            // Close then load list
            this.activeModel.close(true);
          }
        },
        error: (err: any) => {
          this.error = true;
        },
      });
  }

  onClose() {
    this.activeModel.close();
  }

  // OonSUmit
  getValues(val: any) {
    this.onSummit.emit(val);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.formInfo.fields.find(
      (f: any) => f.displaytext === fieldName
    );
    if (field && field.required) {
      return `${field.displaytext} là trường bắt buộc`;
    }
    return '';
  }
}