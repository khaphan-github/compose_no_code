import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomToastService } from 'src/app/views/shared/custom-toart/custom-toast.service';
import { EVENT } from '../../../event/const';
import { ManageApiService } from '../../../services/manage-api.service';
import { ExampleRequestAttributeComponent } from '../example-request-attribute/example-request-attribute.component';
import { ICustomAPI } from '../../../interfaces/custom-api/custom-api.interface';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-update-custom-api',
  templateUrl: './update-custom-api.component.html',
  styleUrls: ['./update-custom-api.component.scss']
})
export class UpdateCustomApiComponent implements OnInit {
  @Input() customApi!: ICustomAPI;
  private readonly service = inject(ManageApiService);
  private readonly activeModal = inject(NgbActiveModal);
  private readonly modal = inject(NgbModal);
  private readonly alert = inject(CustomToastService);

  private readonly fb = inject(FormBuilder);
  apiForm!: FormGroup;
  public CODE_MODEL = {
    language: 'sql',
    uri: 'main.sql',
    value: '',
  }

  public readonly CODE_OPTIONS = {
    contextmenu: true,
  }
  onClose() {
    this.activeModal.close();
  }

  onChangeField(event: any) {
    const newValue = Object.keys(event);
    this.apiForm.patchValue({
      availableField: newValue
    });
  }


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    const availableFields = !_.isEmpty(this.customApi?.availablecolumns) ? this.customApi?.availablecolumns?.map((el) => el.columnName) : '';
    this.apiForm = this.fb.group({
      httpMethod: [this.customApi.http_method, Validators.required],
      domain: [this.customApi.api_path, Validators.required],
      desc: [this.customApi.metadata?.desc,],
      isActive: [this.customApi.enable],
      accessScope: [this.customApi.authentication == 'NO_AUTH' ? 'public' : 'private', Validators.required],
      query: [this.customApi.querystring],
      availableField: [availableFields],
    });

    this.CODE_MODEL = { ...this.CODE_MODEL, value: this.customApi.querystring };
  }

  onSubmit() {
    // Handle form submission logic here
    this.service.updateCustomApi({ ...this.apiForm.getRawValue(), id: this.customApi.id }).subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.activeModal.close(EVENT.CREATE_SUCCESS);
        }

        // Lỗi cơ sở dữ liệu
        if (value.status == 613) {
          this.alert.setState({ title: 'Lỗi khi thêm mới API', desc: value.message, color: 'warning', show: true });
        }
      },
      error: (err) => {
        this.alert.setState({ title: 'Lỗi khi thêm mới API', desc: err?.message, color: 'warning', show: true });
      },
    })
  }

  onViewExample() {
    const detailRequestAttribute = this.modal.open(
      ExampleRequestAttributeComponent,
      {});

    detailRequestAttribute.componentInstance.arrayAttribute = this.apiForm.get('availableField')?.getRawValue();
  }

  onCodeChanged(value: any) {
    this.apiForm.get('query')?.setValue(value);
  }
}
