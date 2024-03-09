import { capitalCase, pascalCase } from 'text-case';
import { DynamicModel } from './dynamic.abtract.model';
import { ApiAction } from './generated-api.model';

export class DynamicFormField {
  public displayText!: string;
  public fieldId!: string; // colums of table
  public datatype!: string; // Data type in db
  public maxLength!: number;
  public minLength!: number;
  public required!: boolean;
  public inputUI!: string; // input.check box, select, readio button.
  public metadata!: object;
}

export class DynamicFormModel extends DynamicModel {
  public id!: number;
  public action!: string; // CREATE - UPDATE - DELETE
  public title!: string; // Display table of string;
  public fields!: Array<DynamicFormField>;
  public status!: boolean;
  public metadata!: object;
  public created_at!: Date;
  public updated_at!: Date;

  convertFromGeneratedAPI(element: object | any) {
    if (element.action == ApiAction.INSERT) {
      const parseColums = JSON.parse(element?.api_authorized);
      return {
        action: element.action,
        title: capitalCase(element.action + '_' + element.table_name),
        fields:
          JSON.stringify(
            parseColums.columns?.map((col) => {
              const field = new DynamicFormField();
              field.datatype = '';
              field.displayText = capitalCase(col.columnName);
              field.maxLength = 256;
              field.minLength = 0;
              field.required = false;
              field.inputUI = 'input';
              return field;
            })
          ) ?? null,
        metadata: {},
      };
    }
  }
}
