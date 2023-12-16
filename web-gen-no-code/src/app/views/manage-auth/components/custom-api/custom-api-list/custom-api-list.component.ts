import { Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { ManageApiService } from '../../../services/manage-api.service';
import { ICustomAPI } from '../../../interfaces/custom-api/custom-api.interface';
import { CreateApiComponent } from '../create-api/create-api.component';
import { EVENT } from '../../../event/const';
import { CustomToastService } from 'src/app/views/shared/custom-toart/custom-toast.service';
import { UpdateCustomApiComponent } from '../update-custom-api/update-custom-api.component';
import { OverideCodeComponent } from '../overide-code/overide-code.component';

@Component({
  selector: 'ngx-custom-api-list',
  templateUrl: './custom-api-list.component.html',
  styleUrls: ['./custom-api-list.component.scss']
})
export class CustomApiListComponent implements OnInit {
  private service = inject(ManageApiService);
  private modal = inject(NgbModal);
  private readonly alert = inject(CustomToastService);
  public list$!: Observable<SResponse<Array<ICustomAPI>>>;


  ngOnInit(): void {
    this.list$ = this.service.customApiList();
  }


  onUpdateCustomApi(customApi: ICustomAPI) {
    const update = this.modal.open(UpdateCustomApiComponent, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
    });

    update.componentInstance.customApi = customApi;

    update.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.customApiList();
        }
      },
    })
  }

  onCreateApi() {
    const createModal = this.modal.open(CreateApiComponent, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
    });

    createModal.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.customApiList();
        }
      },
    })
  }

  onDelete(customApi: ICustomAPI) {
    this.service.deleteCustomApi(customApi.id).subscribe({
      next: (value) => {
        if (value) {
          this.list$ = this.service.customApiList();
        }
      },
      error: (err) => {
        this.alert.setState({ show: true, title: 'Lỗi khi xóa API', desc: err.message, color: 'warning' });
      }
    })
  }

  onDecentralize(customApi: ICustomAPI) {
  }


  overideCode(customApi: ICustomAPI) {
    const overideCode = this.modal.open(
      OverideCodeComponent,
      {
        backdrop: 'static',
        size: 'lg',
        keyboard: false,
      }
    );
  }

}
