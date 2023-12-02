import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { GeneratedAPI } from '../../../interfaces/response/generated-api.interface';
import { ManageApiService } from '../../../services/manage-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EVENT } from '../../../event/const';
import { ApiDocsComponent } from '../docs/api-docs.component';
import { UpdateApiComponent } from '../update-api/update-api.component';

@Component({
  selector: 'ngx-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.scss']
})
export class ApiListComponent implements OnInit {
  private service = inject(ManageApiService);
  private modal = inject(NgbModal);

  constructor() { }

  public list$!: Observable<SResponse<Array<GeneratedAPI>>>;


  ngOnInit(): void {
    this.list$ = this.service.apiList();
  }

  onViewDocs(api: GeneratedAPI) {
    const viewDocsModal = this.modal.open(ApiDocsComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });

    viewDocsModal.componentInstance.api = api;

    viewDocsModal.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.apiList();
        }
      },
    })
  }

  onSetting() {

  }

  onUpdateApi(api: GeneratedAPI) {
    const updateModal = this.modal.open(UpdateApiComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    updateModal.componentInstance.api = api;

    updateModal.closed.subscribe({
      next: (value) => {
        if (value == EVENT.CREATE_SUCCESS) {
          this.list$ = this.service.apiList();
        }
      },
    })
  }
}
