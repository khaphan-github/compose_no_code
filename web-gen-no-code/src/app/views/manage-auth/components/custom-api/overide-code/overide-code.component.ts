import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-overide-code',
  templateUrl: './overide-code.component.html',
  styleUrls: ['./overide-code.component.scss']
})
export class OverideCodeComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  exampleFormControl: FormControl = new FormControl();

  public readonly CODE_MODEL = {
    language: 'javascript',
    uri: 'main.json',
    value: '{}',
  }

  public readonly CODE_OPTIONS = {
    contextmenu: true,
  }


  onCodeChanged(value: any) {
    this.exampleFormControl.setValue(value);
   }
  constructor() { }

  ngOnInit() {
    this.exampleFormControl.setValue(`
    function filter(args) {
      const result = args?.a + args?.b;
      return JSON.stringify({ c: result }) }
    `);
  }

  onClose() {
    this.activeModal.close();
  }


  onSave() { }
}
