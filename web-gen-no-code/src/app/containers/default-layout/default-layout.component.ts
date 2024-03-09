import { Component, OnInit, inject } from '@angular/core';
import { INavData } from '@coreui/angular';
import { HttpClient } from '@angular/common/http';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { navItems } from './_nav';
import { ConnectedToServerEvent } from 'src/app/views/manage-auth/event/connected-to-server.event';
import { ApiGenratedEvent } from 'src/app/event/api-genrated.event';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;

  private apiGeneratedEvent = inject(ApiGenratedEvent);
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.apiGeneratedEvent.getState().subscribe({
      next: (value) => {
        this.navItems = navItems;
        this.fetchNavData();
      },
    });
  }

  fetchNavData(): void {
    this.httpClient
      .post<SResponse<Array<any>>>(
        apiPathBuilder('/_core_dynamic_menu/query'),
        {}
      )
      .subscribe({
        next: (value) => {
          this.convertToNavData(value.data);
        },
      });
  }

  convertToNavData(jsonData: Array<any>) {
    const newNav = {
      name: 'Form',
      url: 'form',
      iconComponent: { name: 'cil-indent-increase' },
      badge: {
        color: 'success',
        text: 'New',
      },
      children: jsonData.map((item: any) => {
        return {
          name: item.displayname,
          url: 'form/' + item.id,
          iconComponent: { name: item.icon },
        };
      }),
    };

    this.navItems = [...this.navItems, newNav];
  }
}
