import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateApiComponent } from '../../custom-api/create-api/create-api.component';
import { Observable, map } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { EVENT } from '../../../event/const';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  public readonly service = inject(ManageApiService);
  private readonly modal = inject(NgbModal);
  private readonly routing = inject(Router);

  form!: FormGroup;
  public outputMessage: any;
  public isError: boolean = false;
  public outputData: any;
  public listTableName$!: Observable<SResponse<Array<any>>>;

  constructor(private fb: FormBuilder) { }

  public waitingToLoad: boolean = false;
  ngOnInit(): void {
    this.form = this.fb.group({
      floatingInput: ['', [Validators.required]]
    });
    const whiteList = ['_core_workspace_config', '_core_generated_apis', '_core_applications', '_core_account', '_core_role', '_core_custom_api'];

    this.listTableName$ = this.service.getTableName().pipe(map((res) => {
      const filterTable = res.data.filter((va) => !whiteList.includes(va.table_name))
      return { ...res, data: filterTable }
    }));
  }

  onSubmit() {
    // Add your form submission logic here
    if (this.form.valid) {
      this.isError = false;
      this.form.disable();
      this.waitingToLoad = true;
      this.service.transformer(this.form.get('floatingInput')?.value).subscribe({
        next: (value) => {
          if (value.status == 200) {
            this.outputMessage = JSON.stringify(value.data.answer.result, null, 2);
            this.outputData = value.data.answer.queryString;
          } else {
            this.outputMessage = 'Rất tiết, tôi không thể tìm thấy dữ liệu theo yêu cầu của bạn'
            this.isError = true;
          };

          this.form.enable();
          this.waitingToLoad = false;
        },
        error: (err) => {
          this.waitingToLoad = false;
          this.isError = true;
          this.form.enable();
        },
      })
    }
  }

  onSaveToApi() {
    const createModal = this.modal.open(CreateApiComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    createModal.closed.subscribe({
      next: (value) => {
        if(value == EVENT.CREATE_SUCCESS) {
          this.routing.navigate(['manage-api/custom-api'])
        }
      },
    })
    createModal.componentInstance.queryString = this.outputData;
    createModal.componentInstance.desc = this.form.get('floatingInput')?.value;
  }
}
