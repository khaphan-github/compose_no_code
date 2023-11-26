import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageApiService } from '../../../services/manage-api.service';
import { Observable, tap } from 'rxjs';
import { GeneratedAPI } from '../../../interfaces/response/generated-api.interface';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { ComponentCheckBoxHelper } from 'src/app/views/shared/helpers/check-box.helper';
import { Role } from '../../../interfaces/roles/role.interface';
import { IUpdateRole } from '../../../interfaces/roles/update-role.interface';
import { EVENT } from '../../../event/const';
import * as _ from 'lodash';

@Component({
  selector: 'app-decentralize',
  templateUrl: './decentralize.component.html',
  styleUrls: ['./decentralize.component.css']
})
export class DecentralizeComponent implements OnInit {
  @Input() role!: Role;

  private activeModal = inject(NgbActiveModal);
  private service = inject(ManageApiService);
  public list$!: Observable<SResponse<Array<GeneratedAPI>>>;

  public checkBoxHelper = new ComponentCheckBoxHelper<GeneratedAPI>('id');

  constructor() { }

  ngOnInit() {
    // Get one;
    _.forEach(this.role.metadata?.apis, (value) => {
      this.checkBoxHelper.handleOneChecked(true, { id: value });
    });

    this.list$ = this.service.apiList();
  }

  onClickRow(api: GeneratedAPI) {
    this.checkBoxHelper.handleOneChecked(!this.checkBoxHelper.selectedItems.has(api.id), api);
  }

  onSubmit() {
    // Handle form submission
    const roleToCreate: IUpdateRole = {
      ...this.role,
      metadata: JSON.stringify({ apis: this.checkBoxHelper.getArraySelected().map((api) => api.id) }),
    };
    this.service.updateRole(roleToCreate).subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.activeModal.close(EVENT.CREATE_SUCCESS);
        }
      },
    });
  }

  onClose() {
    this.activeModal.close();
  }

  activeAll(apis: Array<GeneratedAPI>, mode: boolean) {
    _.forEach(apis, (api) => {
      this.checkBoxHelper.handleOneChecked(mode, api);
    })
  }
}
