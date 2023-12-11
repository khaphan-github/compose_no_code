import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageApiService } from '../../../services/manage-api.service';
import { ExampleRequestAttributeComponent } from '../example-request-attribute/example-request-attribute.component';
import { EVENT } from '../../../event/const';
import { CustomToastService, TToast } from 'src/app/views/shared/custom-toart/custom-toast.service';
import { ICreateAPI } from '../../../interfaces/api/create-api.interface';

@Component({
  selector: 'ngx-create-api',
  templateUrl: './create-api.component.html',
  styleUrls: ['./create-api.component.scss']
})
export class CreateApiComponent implements OnInit {
  @Input() queryString!: string;
  @Input() desc!: string;
  private readonly service = inject(ManageApiService);
  private readonly activeModal = inject(NgbActiveModal);
  private readonly modal = inject(NgbModal);
  private readonly alert = inject(CustomToastService);

  private readonly fb = inject(FormBuilder);
  apiForm!: FormGroup;


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
    this.apiForm = this.fb.group({
      httpMethod: ['POST', Validators.required],
      desc: [this.desc ? this.desc : ''],
      domain: ['', Validators.required],
      isActive: [true],
      accessScope: ['public', Validators.required],
      query: [this.queryString ? this.queryString : ''],
      availableField: [''],
    });
  }

  onSubmit() {
    // Handle form submission logic here
    this.service.createApi(this.apiForm.value).subscribe({
      next: (value) => {
        if (value.status == 201) {
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
}


