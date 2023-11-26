import axios, { AxiosRequestConfig } from 'axios';

describe('Api endpoint follow format app/:appid/schema/:schemaName', () => {
  let axiosConfig: AxiosRequestConfig<unknown>;
  beforeAll(() => {
    axiosConfig = {
      method: 'post',
      data: []
    };
  });
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    axiosConfig.data = [];
    axiosConfig.url = '';
  })

  it('Should return status 618 when schema not found', async () => {
    const url = '/app/9999/schema/wrong-schema-name';
    axiosConfig.url = url;
    const response = await axios.request(axiosConfig);
    expect(response.data.status).toBe(618);
  });

  it('Should return status 618 when application table not found', async () => {
    const url = '/app/0000000/schema/products';
    axiosConfig.url = url;
    const response = await axios.request(axiosConfig);
    expect(response.data.status).toBe(618);
  });
});