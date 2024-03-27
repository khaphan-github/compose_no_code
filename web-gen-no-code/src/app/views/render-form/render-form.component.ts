import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-render-form',
  templateUrl: './render-form.component.html',
  styleUrls: ['./render-form.component.css'],
})
export class RenderFormComponent implements OnInit {
  constructor(
    private modal: NgbModal
  ) {}

  ngOnInit() {
     
  }
 
  update( ) {
    const modalRef = this.modal.open(UpdateComponent, {
      size: 'lg',
    });
     
  }

  onCreate() {
    const modalRef = this.modal.open(CreateComponent, {
      size: 'lg',
    });
  
  }

  
}
