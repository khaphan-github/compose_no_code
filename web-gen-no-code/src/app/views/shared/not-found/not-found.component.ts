import { Component, OnInit } from '@angular/core';
import { ContainerComponent, GridModule } from '@coreui/angular';

@Component({
  standalone: true,
  imports: [ContainerComponent, GridModule],
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  date = new Date();
  constructor() { }

  ngOnInit() {
  }


}
