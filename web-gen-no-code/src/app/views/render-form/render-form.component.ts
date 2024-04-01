import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, switchMap, map, EMPTY } from 'rxjs';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { SResponse } from 'src/app/core/config/http-client/response-base';
interface TableRow {
  id: number;
  name: string;
  email: string;
  address: string;
}

interface TableColumn {
  field: keyof TableRow;
  label: string;
}
@Component({
  selector: 'app-render-form',
  templateUrl: './render-form.component.html',
  styleUrls: ['./render-form.component.css'],
})
export class RenderFormComponent implements OnInit {
  constructor(
    private r: ActivatedRoute,
    private httpClient: HttpClient,
    private modal: NgbModal
  ) { }

  public formData: any;
  public tableData: any[] = [];

  public currentPage = 1;

  loadData$ = new Subject<any>();
  loading = false;

  ngOnInit() {
    this.r.params
      .pipe(
        switchMap((params: Params) => {
          const formID = params['id'];
          const condition = {
            id: formID
          }
          return this.httpClient
            .post<SResponse<Array<any>>>(
              apiPathBuilder('/_core_dynamic_form/query'),
             { condition: condition }
            )
        }),
        switchMap((form) => {
          const foundForm = form.data[0];
          this.formData = foundForm
          return this.getData(foundForm.metadata.table_name, 1, 10, '');
        })
      )
      .subscribe({
        next: (value) => {
          this.tableData = value.data;
        },
      });
  }

  getData(tableName: string, page: number, size: number, search: string) {
    return this.httpClient.post<SResponse<Array<any>>>(
      apiPathBuilder(`/${tableName}/query?page=${page}&size=${size}`),
      {}
    );
  }

  changePage = (isNext: boolean) => {
    if (isNext) {
      this.currentPage += 1;
    } else {
      if (this.currentPage > 1) {
        this.currentPage--;
      } else {
        this.currentPage = 1;
      }
    }

    this.loadNewData();
  };

  update($event: any) {
    const modalRef = this.modal.open(UpdateComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.item = $event;
    modalRef.componentInstance.tableName = this.formData.metadata.table_name;
    modalRef.componentInstance.formInfo = this.formData;
    modalRef.closed.subscribe({
      next: (value) => {
        if (value) {
          this.loadNewData();
        }
      },
    });
  }

  onCreate() {
    const modalRef = this.modal.open(CreateComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.formInfo = this.formData;
    modalRef.closed.subscribe({
      next: (value) => {
        if (value) {
          this.loadNewData();
        }
      },
    });
  }

  loadNewData() {
    this.getData(
      this.formData.metadata.table_name,
      this.currentPage,
      10,
      ''
    ).subscribe({
      next: (value) => {
        this.tableData = value.data;
      },
      error: (err) => {
        console.log(err);
        this.tableData = [];
      },
    });
  }
}
