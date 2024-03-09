import { capitalCase, paramCase, pascalCase } from 'text-case';
import { DynamicModel } from './dynamic.abtract.model';
import { ApiAction } from './generated-api.model';

export class DynamicMenuModel extends DynamicModel {
  public id!: number;
  public displayName!: string;
  public feRoute!: string;
  public icon!: string;
  public parentId!: number;
  public metadata!: object;
  public created_at!: Date;
  public updated_at!: Date;

  convertFromGeneratedAPI(element: object | any) {
    if (element.action == ApiAction.INSERT) {
      const menu = new DynamicMenuModel();
      menu.displayName = capitalCase(element.table_name);
      menu.feRoute = '/form/' + paramCase(element.table_name);
      menu.icon = '';
      menu.metadata = {};
      return menu;
    }
  }
}
