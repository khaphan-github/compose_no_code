import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneratedAPI } from '../../../interfaces/response/generated-api.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';
import { EVENT } from '../../../event/const';
import { ComponentCheckBoxHelper } from 'src/app/views/shared/helpers/check-box.helper';
import * as _ from 'lodash';

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
  public checkBoxHelper = new ComponentCheckBoxHelper<{ columnName: string, active: boolean, metadata: any }>('columnName');
  public allowModifyColumns = new ComponentCheckBoxHelper<{ columnName: string, active: boolean, metadata: any }>('columnName');

  constructor() { }

  ngOnInit() {
    _.forEach(this.api?.api_authorized?.columns, (value) => {
      this.checkBoxHelper.handleOneChecked(value?.active, value);
    });

    _.forEach(this.api?.api_authorized?.modify, (value) => {
      this.allowModifyColumns.handleOneChecked(value?.active, value);
    });

    this.updateApiForm = this.fb.group({
      accessScope: [this.api.authentication == 'NEED_AUTH' ? 'private' : 'public'],
      isActive: [this.api.enable]
    });
  }

  onSubmit() {
    const { accessScope, isActive } = this.updateApiForm.value;

    const columns = this.api?.api_authorized?.columns?.map((el: any) => {
      return { ...el, active: this.checkBoxHelper.checkedThisItem(el) };
    })

    const modifyColumns = this.api?.api_authorized?.modify?.map((el: any) => {
      return { ...el, active: this.allowModifyColumns.checkedThisItem(el) };
    })

    this.service.updateApi(this.api.id, accessScope, isActive, columns, modifyColumns).subscribe({
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

  onClickRow(column: any) {
    this.checkBoxHelper.handleOneChecked(!this.checkBoxHelper.selectedItems.has(column.columnName), column);
  }

  onClickModifyRow(column: any) {
    this.allowModifyColumns.handleOneChecked(!this.allowModifyColumns.selectedItems.has(column.columnName), column);
  }
}
