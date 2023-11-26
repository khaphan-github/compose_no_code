import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageApiService } from '../../manage-auth/services/manage-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form!: FormGroup;
  private route = inject(Router);

  constructor(
    private fb: FormBuilder,
    private readonly service: ManageApiService,
  ) { }

  public errorMessage: string = '';
  ngOnInit(): void {
    this.form = this.fb.group({
      domain: [
        'http://localhost:3000',
        [Validators.required, Validators.pattern(/^(http|https):\/\//)],
      ],
      secretKey: ['', [Validators.required]],
    });
  }

  submitForm() {
    if (this.form.valid) {
      const domainValue = this.form.get('domain')?.value;
      const secretKeyValue = this.form.get('secretKey')?.value;

      this.service.connectToServer(domainValue, secretKeyValue).subscribe({
        next: (value) => {
          if (value.status == 401) {
            this.displayError();
          }
          if (value.status == 200) {
            this.route.navigate(['dashboard'])
          }
        },
        error: (err) => {
          this.displayError();
        },
      })
    }
  }

  displayError = () => {
    this.errorMessage = `Không thể kết nối đến server, vui lòng kiểm tra tên miền và khóa bí mật`;
  }
}
