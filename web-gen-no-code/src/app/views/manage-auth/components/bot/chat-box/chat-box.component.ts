import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateApiComponent } from '../../custom-api/create-api/create-api.component';

@Component({
  selector: 'ngx-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  form!: FormGroup;
  public outputMessage: any;
  public isError: boolean = false;
  public outputData: any;
  public readonly service = inject(ManageApiService);
  private readonly modal = inject(NgbModal);
  constructor(private fb: FormBuilder) { }

  public waitingToLoad: boolean = false;
  ngOnInit(): void {
    this.form = this.fb.group({
      floatingInput: ['', [Validators.required]]
    });
  }

  onSubmit() {
    // Add your form submission logic here
    if (this.form.valid) {
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
    const createModal = this.modal.open(CreateApiComponent, {});
    createModal.componentInstance.queryString = this.outputData;
  }
}
