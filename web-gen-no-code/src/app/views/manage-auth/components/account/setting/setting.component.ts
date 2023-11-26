import { Component, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { Role } from '../../../interfaces/roles/role.interface';
import { ManageApiService } from '../../../services/manage-api.service';
import { EVENT } from '../../../event/const';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private service = inject(ManageApiService);

  constructor() { }


  selectedRoleId!: number;

  onRoleSelect() {
    console.log('Selected Role ID:', this.selectedRoleId);
  }

  public roleList$!: Observable<SResponse<Array<Role>>>;

  ngOnInit(): void {
    this.roleList$ = this.service.roleList();
  }

  onSubmit() {
    this.service.updateWorspaceGeneralConfig(this.selectedRoleId).subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.activeModal.close(EVENT.CREATE_SUCCESS);
        }
      },
    })
    // Handle form submission
  }

  onClose() {
    this.activeModal.close();
  }
}
