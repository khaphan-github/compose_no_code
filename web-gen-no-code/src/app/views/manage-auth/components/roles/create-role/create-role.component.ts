import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageApiService } from '../../../services/manage-api.service';
import { ICreateRole } from '../../../interfaces/roles/create-role.interface';
import { EVENT } from '../../../event/const';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit {
  form!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private activeModal = inject(NgbActiveModal);
  private service = inject(ManageApiService);

  constructor() { }

  ngOnInit() {
    this.form = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      activateOnCreate: [true],
    });
  }

  onSubmit() {
    // Handle form submission
    if (this.form.valid) {
      const { displayName, description, activateOnCreate } = this.form.value;
      const roleToCreate: ICreateRole = {
        display_name: displayName,
        description: description,
        enable: activateOnCreate,
        metadata: {},
      };

      this.service.createRole(roleToCreate).subscribe({
        next: (value) => {
          if (value.status ==  201) {
            this.activeModal.close(EVENT.CREATE_SUCCESS);
          }
        },
      });

      console.log('Form submitted:', this.form.value);
      // You can send the form data to your backend or perform other actions here
    }
  }

  onClose() {
    this.activeModal.close();
  }
}
