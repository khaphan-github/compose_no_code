import { Component, Input, OnInit } from '@angular/core';
import { SpinnerModule } from '@coreui/angular';

@Component({
  standalone: true,
  imports: [
    SpinnerModule
  ],
  selector: 'app-waiting-to-load',
  templateUrl: './waiting-to-load.component.html',
  styleUrls: ['./waiting-to-load.component.css']
})
export class WaitingToLoadComponent implements OnInit {
  @Input() show: boolean = false;
  constructor() { }
  ngOnInit() {
  }

}
