import _ from "lodash";
import { AST, Create } from "node-sql-parser";

export class DbQueryDomain {
  getTableName(appId: string, tableName: string) {
    // return `app_${appId}_${tableName}`;
    return `${tableName}`
  }

  getTableColumnNameArray = (tableInfo: object[], property: string): string[] => {
    return tableInfo.map(item => item[property]);
  };

  extractTableInforFromSQLParser = (parsed: AST | AST[]) => {
    return JSON.stringify(parsed);
  }

  convertTableNameByAppId(appId: number, parsed: AST | AST[]) {
    // get table;
    const renameTable = (appId: number, tableName: string) => {
      return `app_${appId}_${tableName.toLocaleLowerCase()}`;
    }

    const findAttribute = (ast: Create) => {
      const newAst = _.cloneDeep(ast);

      if (newAst?.table[0]?.table) {
        newAst.table[0].table = renameTable(appId, newAst.table[0]?.table);
      }
      _.forEach(newAst?.create_definitions, (value) => {
        if (value?.reference_definition?.table[0]?.table) {
          value.reference_definition.table[0].table = renameTable(appId, value.reference_definition.table[0].table);
        }
      });
      return newAst;
    }
    if (parsed && _.isArray(parsed)) {
      return _.map(parsed, (ast: Create) => {
        return findAttribute(ast);
      });
    } else {
      return findAttribute(parsed as Create);
    }
  }

  getTableNameFromParser(parsed: AST | AST[]) {
    const returnTableName = (ast: Create) => ast?.table[0]?.table;

    if (_.isArray(parsed)) {
      return _.map(parsed, (ast: Create) => {
        return returnTableName(ast);
      });
    } else {
      return returnTableName(parsed as Create);
    }
  }
}