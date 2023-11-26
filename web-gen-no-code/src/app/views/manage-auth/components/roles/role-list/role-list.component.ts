import { Component, OnInit, inject } from '@angular/core';
import { ManageApiService } from '../../../services/manage-api.service';
import { Observable } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { GeneratedAPI } from '../../../interfaces/response/generated-api.interface';
import { Role } from '../../../interfaces/roles/role.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRoleComponent } from '../create-role/create-role.component';
import { EVENT } from '../../../event/const';
import { UpdateRoleComponent } from '../update-role/update-role.component';
import { DecentralizeComponent } from '../decentralize/decentralize.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  private service = inject(ManageApiService);
  private modal = inject(NgbModal);

  constructor() { }

  public list$!: Observable<SResponse<Array<Role>>>;


  ngOnInit(): void {
    this.list$ = this.service.roleList();
  }

  onCreate() {
    const createModal = this.modal.open(CreateRoleComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    createModal.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.roleList();
        }
      },
    })
  }

  onUpdate(role: Role) {
    const updateModal = this.modal.open(UpdateRoleComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    updateModal.componentInstance.role = role;

    updateModal.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.roleList();
        }
      },
    })
  }

  onAddApi(role: Role) {
    const des = this.modal.open(DecentralizeComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });

    des.componentInstance.role = role;
    des.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.roleList();
        }
      },
    })
  }
}
