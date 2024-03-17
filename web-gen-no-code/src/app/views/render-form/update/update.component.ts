import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { SResponse } from 'src/app/core/config/http-client/response-base';

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
  ],
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  @Input() item: any;
  @Input() tableName!: string;
  @Input() formInfo: any;

  dynamicForm!: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    public activeModel: NgbActiveModal
  ) {}

  ngOnInit() {
    const formControls: any = {};
    this.formInfo.fields.forEach((field: any) => {
      formControls[field.fieldId] = [
        this.item[field.fieldId],
        field.required ? Validators.required : null,
      ];
    });
    this.dynamicForm = this.fb.group(formControls);
  }

  onSubmit() {
    this.httpClient
      .put<SResponse<Array<any>>>(
        apiPathBuilder(
          `/${this.formInfo.metadata.table_name}/${this.item.id}?id_column=id`
        ),
        this.dynamicForm.value
      )
      .subscribe({
        next: (value) => {
          if (value) {
            this.activeModel.close(true);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  onClose() {}

  onDelete() {
    this.httpClient
      .delete<SResponse<any>>(
        apiPathBuilder(`/${this.tableName}/${this.item.id}?id_column=id`)
      )
      .subscribe({
        next: (value) => {
          this.activeModel.close(true);
        },
      });
  }
}
