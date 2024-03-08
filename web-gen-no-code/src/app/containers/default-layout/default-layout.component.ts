import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: INavData[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchNavData();
  }

  fetchNavData(): void {
    this.http
      .get<any>('api/v1/app/2024/schema/_core_dynamic_menu/query')
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          // Assuming the response contains the navigation data in the format you expect
          this.navItems = this.convertToNavData(response);
          console.log('Converted NavItems:', this.navItems);
        },
        (error) => {
          console.error('Error fetching navigation data:', error);
        }
      );
  }

  // constructor() {
  //   this.navItems = this.convertToNavData([
  //     {
  //       title: true,
  //       displayName: 'Quản lý hệ thống',
  //     },
  //     {
  //       displayName: 'Chuyển đỗi',
  //       feRoute: '/manage-api/app',
  //       icon: { name: 'cil-transfer' },
  //     },
  //     {
  //       displayName: 'APIs',
  //       feRoute: '/manage-api/apis',
  //       icon: { name: 'cil-pencil' },
  //     },
  //     {
  //       displayName: 'Custom APIs',
  //       feRoute: '/manage-api/custom-api',
  //       icon: { name: 'cil-settings' },
  //     },
  //     {
  //       displayName: 'Nhóm quyền',
  //       feRoute: '/manage-api/role',
  //       icon: { name: 'cil-spreadsheet' },
  //     },
  //     {
  //       displayName: 'Tài khoản',
  //       feRoute: '/manage-api/account',
  //       icon: { name: 'cil-people' },
  //       parentld: [
  //         {
  //           displayName: 'Thông tin cá nhân',
  //           feRoute: '/manage-api/account/personal-info',
  //         },
  //         {
  //           displayName: 'Cài đặt',
  //           feRoute: '/manage-api/account/settings',
  //         },
  //       ],
  //     },
  //     {
  //       displayName: 'Bot SQL',
  //       feRoute: '/manage-api/bot',
  //       icon: { name: 'cil-lightbulb' },
  //     },
  //     {
  //       displayName: 'System Logs',
  //       feRoute: '/manage-api/logs',
  //       icon: { name: 'cil-indent-increase' },
  //       otherInfo: {
  //         color: 'success',
  //         text: 'New',
  //       },
  //     },
  //   ]); // Call convertToNavData with the initial navItems data
  //   console.log('Converted NavItems:', this.navItems); // Log the converted navItems to the console
  // }

  convertToNavData(jsonData: any): INavData[] {
    const navItems: INavData[] = [];

    jsonData.forEach((item: any) => {
      const navItem: INavData = {
        title: true,
        name: item.displayName,
        url: item.feRoute,
        iconComponent: item.icon,
        children: item.parentld,
        badge: item.otherInfo,
      };
      navItems.push(navItem);
    });

    return navItems;
  }
}
