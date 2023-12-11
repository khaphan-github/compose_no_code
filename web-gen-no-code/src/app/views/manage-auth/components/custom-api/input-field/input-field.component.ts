import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HighlightModule } from 'ngx-highlightjs';
import { ReplaceSpaceDirective } from 'src/app/views/shared/directive/replace-white-space.directive';
import { buildObjectToJson } from './input-field.util';
import * as _ from 'lodash';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    GridModule,
    ReplaceSpaceDirective,
    IconModule,
    CardModule,
    HighlightModule,
  ],

  selector: 'ngx-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {
  @Input() currentFields!: Array<string>;
  @Output() formValueChange = new EventEmitter<any>();
  dynamicForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.currentFields && this.currentFields.length !== 0) {
      this.dynamicForm = this.formBuilder.group({});

      _.forEach(this.currentFields, (field) => {
        const newFieldName = `object_key_${Object.keys(this.dynamicForm.value).length + 1}`;
        this.dynamicForm.addControl(newFieldName, this.formBuilder.control(field, Validators.required));
      });
    } else {
      this.initializeForm();
    }

    this.dynamicForm.valueChanges.subscribe({
      next: (value) => {
        this.displayObject = buildObjectToJson(value);
        this.formValueChange.emit(JSON.parse(this.displayObject));
      },
    })
  }

  public displayObject = '';

  initializeForm() {
    this.dynamicForm = this.formBuilder.group({});
  }

  addField() {
    // Add a new form control dynamically
    const newFieldName = `object_key_${Object.keys(this.dynamicForm.value).length + 1}`;
    this.dynamicForm.addControl(newFieldName, this.formBuilder.control('', Validators.required));

    // Emit the updated form value
  }

  removeControl(key: string) {
    this.dynamicForm.removeControl(key);
  }
}
