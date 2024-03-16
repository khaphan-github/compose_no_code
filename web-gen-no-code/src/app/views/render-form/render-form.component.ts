import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, switchMap } from 'rxjs';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';

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
  ) {}

  public formData: any;
  public tableData: any[] = [];

  public currentPage = 1;

  loadData$ = new Subject<any>();
  loading = false;

  ngOnInit() {
    this.loadData$
      .pipe(
        switchMap((value) => {
          return this.getData(value.table_name, value.currentPage, 10, '');
        })
      )
      .subscribe({
        next: (value) => {
          this.tableData = value.data;
        },
        error: (err) => {
          this.tableData = [];
        },
      });

    this.r.paramMap.subscribe((params) => {
      // TODO: Get form info by
      const formID = params.get('id');
      this.httpClient
        .post<SResponse<Array<any>>>(
          apiPathBuilder('/_core_dynamic_form/query'),
          {}
        )
        .subscribe({
          next: (value) => {
            this.formData = value.data.find((v) => v.id == formID);
            this.loadNewData();
          },
        });
    });
  }

  onSummit($event: any) {
    console.log($event);
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
    const modalRef = this.modal.open(UpdateComponent);
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
    const modalRef = this.modal.open(CreateComponent);
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
    this.loadData$.next({
      table_name: this.formData.metadata.table_name,
      currentPage: this.currentPage,
    });
  }
}
