import { Component, OnInit, inject } from '@angular/core';
import { ManageApiService } from '../manage-auth/services/manage-api.service';

import { Observable } from 'rxjs';
import { SResponse } from '../../core/config/http-client/response-base';
import { GeneratedAPI } from '../manage-auth/interfaces/response/generated-api.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private modalService = inject(NgbModal);
  constructor(
    private readonly service: ManageApiService,
  ) { }


  public list$!: Observable<SResponse<Array<GeneratedAPI>>>;


  ngOnInit(): void {
    this.list$ = this.service.apiList();
  }

  public visible = false;

  toggleLiveDemo(api: GeneratedAPI) {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
}
