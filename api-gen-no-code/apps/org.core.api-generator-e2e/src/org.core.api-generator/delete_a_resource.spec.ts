import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';

describe('Delete a resource', () => {
  let axiosConfig: AxiosRequestConfig<unknown>;
  let idToDelete = 0;

  const PREFIX_ENDPOINT = `/app/9999/schema/products`;

  beforeAll(() => {
    axiosConfig = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
    };
  });

  beforeEach(async () => {
    const requestBody = [
      {
        "name": "Product need to delete",
        "price": "10000",
      }
    ]
    const createResponse = await axios.post(PREFIX_ENDPOINT, requestBody);
    idToDelete = createResponse.data.data[0].product_id;

    await new Promise(resolve => setTimeout(resolve, 2000));
  })

  it('Should return status 204 when delete success', async () => {
    const url = `${PREFIX_ENDPOINT}/${idToDelete}?id_column=product_id`;
    axiosConfig.url = url;
    const response = await axios.request(axiosConfig);
    expect(response.data.status).toBe(HttpStatusCode.NoContent);
  });


  it('Should return status 617 when id_column not include table column', async () => {
    const url = `${PREFIX_ENDPOINT}/${idToDelete}?id_column=wrong_column_id`;
    axiosConfig.url = url;
    const response = await axios.request(axiosConfig);
    expect(response.data.status).toBe(617);
  });

  it('Should return status 600 when record not found in db', async () => {
    const url = `${PREFIX_ENDPOINT}/${idToDelete}?id_column=product_id`;

    axiosConfig.url = url;
    const response = await axios.request(axiosConfig);
    expect(response.data.status).toBe(HttpStatusCode.NoContent);

    const resonseWhenError = await axios.request(axiosConfig);
    expect(resonseWhenError.data.status).toBe(610);
  });
});