import { Component, Input, OnInit, inject } from '@angular/core';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { ManageApiService } from '../../../views/manage-auth/services/manage-api.service';
import { STORAGED_KEY } from 'src/app/core/config/storage-key/localstorage.const';
import { ConnectedToServerEvent } from 'src/app/views/manage-auth/event/connected-to-server.event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  @Input() sidebarId: string = "sidebar";
  route = inject(Router);
  constructor(
  ) {
    super();
  }
  public currentDisplayText = `Ngắt kết nối`;
  ngOnInit(): void { }

  onDisconnect() {
    sessionStorage.removeItem(STORAGED_KEY.modules.manageApi.connection.secretKey);
    this.route.navigate(['login']);
  }
}
