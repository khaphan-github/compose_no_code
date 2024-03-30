import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormInfo } from './form-info';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-form',
  templateUrl: './generate-form.component.html',
  styleUrls: ['./generate-form.component.scss'],
})
export class GenerateFormComponent implements OnInit {
  @Input() formInfo!: FormInfo;
  @Output() onSummit = new EventEmitter<any>();

  inputRequired!: FormGroup;

  ngOnInit() {}

  // OonSUmit
  getValues(val: any) {
    this.onSummit.emit(val);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.formInfo.fields.find((f) => f.displaytext === fieldName);
    if (field && field.required) {
      return `${field.displaytext} là trường bắt buộc`;
    }
    return '';
  }
}
