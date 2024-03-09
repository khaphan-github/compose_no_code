import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { SResponse } from 'src/app/core/config/http-client/response-base';

@Component({
  selector: 'app-render-form',
  templateUrl: './render-form.component.html',
  styleUrls: ['./render-form.component.css'],
})
export class RenderFormComponent implements OnInit {
  constructor(private r: ActivatedRoute, private httpClient: HttpClient) {}

  public formData!: any;
  ngOnInit() {
    this.r.paramMap.subscribe((params) => {
      // TODO: Get form info by
      const formName = params.get('id');
      console.log('Form Name:', formName);

      this.httpClient
        .post<SResponse<Array<any>>>(
          apiPathBuilder('/_core_dynamic_form/query'),
          {}
        )
        .subscribe({
          next: (value) => {
            this.formData = value.data.filter((v) => (v.id = formName));
            console.log(value);
          },
        });
    });
  }
}
