import axios, { AxiosRequestConfig } from 'axios';

describe('Query resource', () => {
  let axiosConfig: AxiosRequestConfig<unknown>;
  const PREFIX_ENDPOINT = `/app/9999/schema/products/query`;

  beforeAll(async () => {
    axiosConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
    };
  });

  it('Shoud return 1 object when page equal 0 and size equal 1', async () => {
    const expectSize = 1;
    axiosConfig.url = `${PREFIX_ENDPOINT}?page=0&size=${expectSize}`;

    const response = await axios.request(axiosConfig);
    const { data, status } = response.data;

    expect(status).toEqual(200);
    expect(data.length).toEqual(expectSize);
  });
});