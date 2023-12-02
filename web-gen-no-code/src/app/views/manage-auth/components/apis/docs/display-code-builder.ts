import { STORAGED_KEY } from "src/app/core/config/storage-key/localstorage.const";
import { GeneratedAPI } from "../../../interfaces/response/generated-api.interface";

export class DisplayCodeBuilder {
  // Get

  public static getCode(api: GeneratedAPI) {
    const domain = localStorage.getItem(STORAGED_KEY.modules.manageApi.connection.hostName);
    const authHeader = `
const headers = ${JSON.stringify(api?.headers, null, 2)}
`
    const conditionType = `
// Khai báo định dạng của điều kiện:
export interface ConditionObject {
  and?: ConditionObject[];
  or?: ConditionObject[];
  [key: string]: string | ConditionObject[] | undefined;
}
`
    switch (api.action) {
      case 'QUERY':
        const query = `
${conditionType}
import axios from 'axios'; // Link: https://axios-http.com/vi/docs/intro

const apiUrl = "${domain}/api/v1/app/2024/schema${api.api_path}";

const params = {
  // Điền các thuộc tính bạn muốn lấy tại đây - mạc định lấy hết những cột có trong bảng
  selects: [${Object.keys(api?.request_body[0]).map((key) => `'${key}'`)}],
  page: 0,
  size: 10,
  orderby: '${Object.keys(api?.request_body[0])[0]}', // Bạn có thể điền các key khác tại đây để sắp xếp
  sort: 'ASC',   // <-- Truy vấn này nhận 2 giá trị: 'ASC' Và 'DESC'
};

// Optional: Bạn có thể điền truy vấn tại đây nếu muốn truy vấn chi tiết
const conditionObject: ConditionObject = {
  or: [{ ${Object.keys(api?.request_body[0])[0]}: 1 }, { ${Object.keys(api?.request_body[0])[1]}: 'Example value' }],
};
${api.authentication == 'NEED_AUTH' ? authHeader : ''}
axios.post(apiUrl, conditionObject, { params, ${api.authentication == 'NEED_AUTH' ? 'headers' : ''} })
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
/**
 Example response:
{
  "id": "30b40a21-c296-4d2b-94fd-02892975b080",
  "timestamp": "2023-10-26T08:58:59.283Z",
  "apiVersion": "2.0",
  "status": 200,
  "message": "Query success",
  "data":[${JSON.stringify(api.response_attributes[0], null, 4)}]
}
  */
    `
        return query;

      case 'INSERT':
        const insert = `
import axios from 'axios';
const apiUrl = "${domain}/api/v1/app/2024/schema${api.api_path}";
${api.authentication == 'NEED_AUTH' ? authHeader : ''}
const requestBody = [${JSON.stringify(api?.request_body[0], null, 2)}];

axios.post(apiUrl, requestBody, { ${api.authentication == 'NEED_AUTH' ? 'headers' : ''} })
  .then((response) => {
    console.log('Product created successfully:', response.data);
  })
  .catch((error) => {
    console.error('Error creating product:', error);
  });
`;
        return insert;
        break;
      case 'DELETE':
        return `
import axios from 'axios';

const id = 1; // This is the ID of the product you want to delete
${api.authentication == 'NEED_AUTH' ? authHeader : ''}
const url =
  '${domain}/api/v1/app/2024/schema${api.api_path}/' + id' + '?id_column=id';

axios.delete(url, { ${api.authentication == 'NEED_AUTH' ? 'headers' : ''} })
  .then((response) => {
    console.log('Product deleted successfully');
  })
  .catch((error) => {
    console.error('Error deleting product:', error);
  });
        `
        break;
      default:
        // update
        break;
    }

    return `
import axios from 'axios';

${api.authentication == 'NEED_AUTH' ? authHeader : ''}
const url =
    '${domain}/api/v1/app/2024/schema${api.api_path}/' + id' + '?id_column=id';

const data = ${JSON.stringify(api?.request_body[0], null, 2)}

axios.put(url, data, { ${api.authentication == 'NEED_AUTH' ? 'headers' : ''} })
  .then((response) => {
    console.log('Product updated successfully');
  })
  .catch((error) => {
    console.error('Error updating product:', error);
  });
    `;
  }
}
