import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneratedAPI } from '../../../interfaces/response/generated-api.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';
import { EVENT } from '../../../event/const';

@Component({
  selector: 'ngx-update-api',
  templateUrl: './update-api.component.html',
  styleUrls: ['./update-api.component.scss']
})
export class UpdateApiComponent implements OnInit {
  @Input() api!: GeneratedAPI;
  private service = inject(ManageApiService);
  private activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);

  updateApiForm!: FormGroup;

  constructor() { }

  ngOnInit() {
    this.updateApiForm = this.fb.group({
      accessScope: [this.api.authentication == 'NEED_AUTH' ? 'private' : 'public'],
      isActive: [this.api.enable]
    });
  }

  onSubmit() {
    const { accessScope, isActive } = this.updateApiForm.value;

    this.service.updateApi(this.api.id, accessScope, isActive).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.activeModal.close(EVENT.CREATE_SUCCESS);
        }
      },
    })
  }

  onClose() {
    this.activeModal.close();
  }

}
