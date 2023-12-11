import { Component, Input, OnInit, inject } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { buildObjectToJson } from '../input-field/input-field.util';
import { ButtonModule, CardModule, GridModule, ModalModule } from '@coreui/angular';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [HighlightModule, GridModule, CardModule, ModalModule, ButtonModule],
  selector: 'ngx-example-request-attribute',
  templateUrl: './example-request-attribute.component.html',
  styleUrls: ['./example-request-attribute.component.scss']
})
export class ExampleRequestAttributeComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  @Input() arrayAttribute!: Array<string>;
  public displayObject = '';
  constructor() { }

  ngOnInit() {
    this.displayObject = buildObjectToJson(this.arrayAttribute);
  }

  onClose() {
    this.activeModal.close();
  }
}
