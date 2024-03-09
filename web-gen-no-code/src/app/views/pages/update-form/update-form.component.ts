import { Component,OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.scss']
})
export class UpdateFormComponent implements OnInit {
  // api: any[] = [];
  api: any[] = [];

  constructor(private http: HttpClient) { }

  // fetchData() {
  //   this.http.get('http://localhost:8080/').subscribe((response: any) => {
  //     this.api = [response];
  //     console.log(response);
  //   });
  // }
  fetchData() {
    this.http.get('http://localhost:8080/').subscribe((response: any) => {
      this.api = response;
      console.log(response);
    });
  }
  ngOnInit(): void {
    this.fetchData();
  }
}