import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { ManageApiService } from '../../../services/manage-api.service';
import { Account } from '../../../interfaces/account/account.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateAccountComponent } from '../update-account/update-account.component';
import { EVENT } from '../../../event/const';
import { CreateAccountComponent } from '../create/setting.component';

@Component({
  selector: 'ngx-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  private service = inject(ManageApiService);
  private modal = inject(NgbModal);

  constructor() { }

  public newAccountId: number = 0;

  public list$!: Observable<SResponse<Array<Account>>>;


  ngOnInit(): void {
    this.list$ = this.service.accountList();
  }

  onUpdate(account: Account) {
    const updateModal = this.modal.open(UpdateAccountComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    updateModal.componentInstance.account = account;

    updateModal.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.accountList();
        }
      },
    })
  }


  onCreate() {
    const setting = this.modal.open(CreateAccountComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });


    setting.closed.subscribe({
      next: (value) => {
        const { event, data } = value;
        if (event == EVENT.CREATE_SUCCESS) {
          console.log(data);
          this.newAccountId = data.id;
          this.list$ = this.service.accountList();
        }
      },
    })
  }
}
