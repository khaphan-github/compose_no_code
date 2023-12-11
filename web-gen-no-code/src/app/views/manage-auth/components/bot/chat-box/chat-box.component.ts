import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';

@Component({
  selector: 'ngx-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  form!: FormGroup;
  public outputMessage: any;
  public readonly service = inject(ManageApiService);
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
            this.outputMessage = JSON.stringify(value.data.answer, null, 2);
          } else {
            this.outputMessage = 'Rất tiết, tôi không thể tìm thấy dữ liệu theo yêu cầu của bạn'
          };

          this.form.enable();
          this.waitingToLoad = false;
        },
        error: (err) => {
          this.waitingToLoad = false;
          this.form.enable();
        },
      })
    }
  }

}
