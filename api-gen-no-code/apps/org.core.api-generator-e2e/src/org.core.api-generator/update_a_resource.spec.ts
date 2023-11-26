import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';

describe('Update a resource', () => {
  let axiosConfig: AxiosRequestConfig<unknown>;
  let idToUpdate = 0;
  const PREFIX_ENDPOINT = `/app/9999/schema/products`;

  beforeAll(() => {
    axiosConfig = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
    };
  });

  beforeEach(async () => {
    const requestBody = [{
      "name": "Product need to update",
      "price": "10000",
    }];
    const createResponse = await axios.post(PREFIX_ENDPOINT, requestBody);
    await new Promise(resolve => setTimeout(resolve, 2000));

    idToUpdate = createResponse.data.data[0].product_id;
  })

  it('Should return status 200 when update success', async () => {
    const updateRequestBody = {
      "name": "Product name updated",
      "price": "91000.00",
    }
    const url = `${PREFIX_ENDPOINT}/${idToUpdate}?id_column=product_id`;
    axiosConfig.url = url;
    axiosConfig.data = updateRequestBody;
    const response = await axios.request(axiosConfig);

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.data.status).toBe(HttpStatusCode.Ok);

    expect(response.data.data[0].product_id).toBe(idToUpdate);
    expect(response.data.data[0].name).toBe(updateRequestBody.name);
    expect(response.data.data[0].price).toBe(updateRequestBody.price);
  });
});