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
import { ICustomAPI } from '../../../interfaces/custom-api/custom-api.interface';

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
  public customApiList$!: Observable<SResponse<Array<ICustomAPI>>>;

  public generatedCheckBoxHelper = new ComponentCheckBoxHelper<GeneratedAPI>('id');
  public customApiCheckBoxhelper = new ComponentCheckBoxHelper<ICustomAPI>('id');

  constructor() { }

  ngOnInit() {
    // Get one;
    _.forEach(this.role.metadata?.apis, (value) => {
      this.generatedCheckBoxHelper.handleOneChecked(true, { id: value });
    });

    _.forEach(this.role.metadata?.customApis, (value) => {
      this.customApiCheckBoxhelper.handleOneChecked(true, { id: value });
    });

    this.list$ = this.service.apiList();
    this.customApiList$ = this.service.customApiList();
  }

  onClickRow(api: GeneratedAPI) {
    this.generatedCheckBoxHelper.handleOneChecked(!this.generatedCheckBoxHelper.selectedItems.has(api.id), api);
  }

  onClickCustomApiRow(api: ICustomAPI) {
    this.customApiCheckBoxhelper.handleOneChecked(!this.customApiCheckBoxhelper.selectedItems.has(api.id), api);
  }


  onSubmit() {
    // Handle form submission
    const roleToCreate: IUpdateRole = {
      ...this.role,
      metadata: JSON.stringify({
        apis: this.generatedCheckBoxHelper.getArraySelected().map((api) => api.id),
        customApis: this.customApiCheckBoxhelper.getArraySelected().map((api) => api.id),
      }),
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
      this.generatedCheckBoxHelper.handleOneChecked(mode, api);
    })
  }

  activeCustomApiAll(apis: Array<ICustomAPI>, mode: boolean) {
    _.forEach(apis, (api) => {
      this.customApiCheckBoxhelper.handleOneChecked(mode, api);
    })
  }
}
