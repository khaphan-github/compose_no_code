import { Component, OnInit, inject } from '@angular/core';
import { INavData } from '@coreui/angular';
import { HttpClient } from '@angular/common/http';
import { SResponse } from 'src/app/core/config/http-client/response-base';
import { apiPathBuilder } from 'src/app/core/config/http-client/helper';
import { navItems } from './_nav';
import { ConnectedToServerEvent } from 'src/app/views/manage-auth/event/connected-to-server.event';
import { ApiGenratedEvent } from 'src/event/api-genrated.event';
import { Subject, delay, filter, switchMap, takeUntil, tap } from 'rxjs';
import { CustomToastService } from 'src/app/views/shared/custom-toart/custom-toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;

  private apiGeneratedEvent = inject(ApiGenratedEvent);
  destroy$$ = new Subject<void>();
  private notify = inject(CustomToastService)
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
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
    // Error when create this table slow. 2 giay lay 1 lam.

    this.apiGeneratedEvent
      .getState()
      .pipe(
        tap((va) => {
          console.log(va);
        }),
        takeUntil(this.destroy$$),
        delay(4000),
        switchMap(() =>
          this.httpClient.post<SResponse<Array<any>>>(
            apiPathBuilder('/_core_dynamic_menu/query'),
            {}
          )
        )
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
          url: 'form/' + item.feroute,
          iconComponent: { name: item.icon },
        };
      }),
    };

    this.navItems = [...navItems, newNav];
  }
}
