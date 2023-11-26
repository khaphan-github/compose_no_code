import { Component, Input, OnInit, inject } from '@angular/core';
import { GeneratedAPI } from '../../../interfaces/response/generated-api.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-api',
  templateUrl: './update-api.component.html',
  styleUrls: ['./update-api.component.css']
})
export class UpdateApiComponent implements OnInit {
  @Input() api!: GeneratedAPI;
  private activeModal = inject(NgbActiveModal);

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // Handle form submission
  }

  onClose() {
    this.activeModal.close();
  }
}
