import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EVENT } from '../../../event/const';
import { ICreateRole } from '../../../interfaces/roles/create-role.interface';
import { ManageApiService } from '../../../services/manage-api.service';
import { IUpdateRole } from '../../../interfaces/roles/update-role.interface';
import { Role } from '../../../interfaces/roles/role.interface';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {
  @Input() role!: Role;

  form!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private activeModal = inject(NgbActiveModal);
  private service = inject(ManageApiService);

  constructor() { }

  ngOnInit() {
    this.form = this.fb.group({
      displayName: [this.role.display_name, [Validators.required, Validators.minLength(5)]],
      description: [this.role.description],
      activateOnCreate: [this.role.enable],
      defaultRoleWhenRegister: [this.role.metadata?.defaultWhenRegister ?? false]
    });
  }

  onSubmit() {
    // Handle form submission
    if (this.form.valid) {
      const { displayName, description, activateOnCreate, defaultRoleWhenRegister } = this.form.value;
      const metadata = { ...this.role.metadata, defaultWhenRegister: defaultRoleWhenRegister }
      const roleToCreate: IUpdateRole = {
        ...this.role,
        display_name: displayName,
        description: description,
        enable: activateOnCreate,
        metadata: metadata,
      };

      this.service.updateRole(roleToCreate).subscribe({
        next: (value) => {
          if (value.status == 200) {
            this.activeModal.close(EVENT.CREATE_SUCCESS);
          }
        },
      });
    }
  }

  onDelete() {
    this.service.deleteRole(this.role.id).subscribe({
      next: (value) => {
        if (value.status == 204) {
          this.activeModal.close(EVENT.CREATE_SUCCESS);
        }
      },
    });
  }

  onClose() {
    this.activeModal.close();
  }

}
