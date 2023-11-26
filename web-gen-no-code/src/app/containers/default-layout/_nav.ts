import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Quản lý hệ thống'
  },
  {
    name: 'Tài khoản',
    url: '/manage-api/account',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'APIs',
    url: '/manage-api/apis',
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Nhóm quyền',
    url: '/manage-api/role',
    iconComponent: { name: 'cil-spreadsheet' }
  },
  {
    name: 'Database',
    url: '/manage-api/database',
    iconComponent: { name: 'cil-puzzle' },
    badge: {
      color: 'success',
      text: 'UPDATE-LATER'
    }
  },
];
