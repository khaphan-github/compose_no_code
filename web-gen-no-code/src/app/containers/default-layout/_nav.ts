import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Quản lý hệ thống',
  },
  {
    name: 'Chuyển đỗi',
    url: '/manage-api/app',
    iconComponent: { name: 'cil-transfer' },
  },
  {
    name: 'Form',
    url: '/form',
    iconComponent: { name: 'cil-transfer' },
  },
  {
    name: 'APIs',
    url: '/manage-api/apis',
    iconComponent: { name: 'cil-pencil' },
  },
  {
    name: 'Custom APIs',
    url: '/manage-api/custom-api',
    iconComponent: { name: 'cil-settings' },
  },
  {
    name: 'Nhóm quyền',
    url: '/manage-api/role',
    iconComponent: { name: 'cil-spreadsheet' },
  },
  {
    name: 'Tài khoản',
    url: '/manage-api/account',
    iconComponent: { name: 'cil-people' },
  },
  {
    name: 'Bot SQL',
    url: '/manage-api/bot',
    iconComponent: { name: 'cil-lightbulb' },
  },
  {
    name: 'System Logs',
    url: '/manage-api/logs',
    iconComponent: { name: 'cil-indent-increase' },
  },
];