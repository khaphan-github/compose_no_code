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
  AlertModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    AlertModule,
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
  error: boolean = false;
  constructor(
    private httpClient: HttpClient,
    private fb: FormBuilder,
    public activeModel: NgbActiveModal
  ) { }

  ngOnInit() {
    const formControls: { [key: string]: any } = {};

    this.formInfo.fields.forEach((field: any) => {
      // Check if the fieldId is 'id'
      const disabled = field.fieldId === 'id';

      // Set up validators
      const validators = field.required ? [Validators.required] : null;

      // Set up the form control with the appropriate initial value and validators
      formControls[field.fieldId] = [{ value: this.item[field.fieldId], disabled }, validators];
    });

    // Create the dynamic form using the form controls
    this.dynamicForm = this.fb.group(formControls);
  }

  onSubmit() {
    this.error = false;

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
        error: (err) => {
          console.error(err);
          this.error = true;
        },
      });
  }

  onClose() { }

  onDelete() {
    this.error = false;

    this.httpClient
      .delete<SResponse<any>>(
        apiPathBuilder(`/${this.tableName}/${this.item.id}?id_column=id`)
      )
      .subscribe({
        next: (value) => {
          this.activeModel.close(true);
        },
        error: (err) => {
          console.error(err);
          this.visible = false;
          this.error = true;
        },
      });
  }

  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
}
