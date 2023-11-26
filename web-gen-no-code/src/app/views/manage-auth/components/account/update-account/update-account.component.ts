import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageApiService } from '../../../services/manage-api.service';
import { Observable } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { Role } from '../../../interfaces/roles/role.interface';
import { ComponentCheckBoxHelper } from 'src/app/views/shared/helpers/check-box.helper';
import { Account, IAccountMetadata } from '../../../interfaces/account/account.interface';
import * as _ from 'lodash';
import { IUpdateAccount } from '../../../interfaces/account/update-account.interface';
import { EVENT } from '../../../event/const';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent implements OnInit {
  @Input() account!: Account;

  private service = inject(ManageApiService);
  private activeModal = inject(NgbActiveModal);

  constructor() { }

  public list$!: Observable<SResponse<Array<Role>>>;
  public checkBoxHelper = new ComponentCheckBoxHelper<Role>('id');


  ngOnInit(): void {
    _.forEach(this.account?.metadata?.roleIds, (value) => {
      this.checkBoxHelper.handleOneChecked(true, { id: value });
    });

    this.list$ = this.service.roleList();
  }


  onClickRow(api: Role) {
    this.checkBoxHelper.handleOneChecked(!this.checkBoxHelper.selectedItems.has(api.id), api);
  }

  onSubmit() {
    const listRoles = this.checkBoxHelper.getArraySelected().map((value) => value.id);
    const metadata: IAccountMetadata = {
      roleIds: listRoles,
    }
    const updateAccount: IUpdateAccount = {
      ...this.account, metadata: metadata
    }

    console.log(updateAccount);

    this.service.updateAccount(updateAccount).subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.activeModal.close(EVENT.CREATE_SUCCESS);
        }
      },
    })
  }

  onClose() {
    this.activeModal.close();
  }
}

