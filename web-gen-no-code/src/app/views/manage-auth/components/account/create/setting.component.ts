import { Component, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageApiService } from '../../../services/manage-api.service';
import { EVENT } from '../../../event/const';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class CreateAccountComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private service = inject(ManageApiService);
  private formBuilder = inject(FormBuilder);

  createAccountForm!: FormGroup;
  serverErrorMessage = '';
  constructor() { }
  ngOnInit(): void {
    this.createAccountForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(10)]],
      password: ['', [Validators.required, Validators.min(10)]],
      activate: [true]
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.createAccountForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Trường này không được để trống';
    }
    if (control?.hasError('minlength')) {
      return 'Yêu cầu độ dài phải lớn hơn 10 ký tự';
    }
    return '';
  }


  onSubmit() {
    if (this.createAccountForm.valid) {
      const { username, password, activate } = this.createAccountForm.getRawValue();
      this.service.createAccount({
        enable: activate,
        metadata: {
          roleIds: []
        },
        password: password,
        username: username,
      }).subscribe({
        next: (value) => {
          if (value.status == 200) {
            this.activeModal.close({
              event: EVENT.CREATE_SUCCESS,
              data: value.data,
            });
          }
          if (value.status == 613) {
            this.serverErrorMessage = 'Tài khoản này đã tồn tại';
          }
        },
        error: (err) => {
          this.serverErrorMessage = 'Tài khoản này đã tồn tại';
        },
      })
    }
  }

  onClose() {
    this.activeModal.close();
  }
}
