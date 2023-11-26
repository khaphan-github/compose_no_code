import axios, { AxiosRequestConfig } from 'axios';

describe('Create a resource by app id and table id', () => {
  let axiosConfig: AxiosRequestConfig<unknown>;

  beforeAll(() => {
    axiosConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/app/9999/schema/products',
    };
  });
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    axiosConfig.data = [];
  })

  it('should return status code 201', async () => {
    const data = [{
      "name": "Sample Product",
      "price": "1",
    }];

    axiosConfig.data = data;

    const response = await axios.request(axiosConfig);
    expect(response.status).toBe(201);
  });

  it('Should return data match with request', async () => {
    const requestBody = [
      {
        "name": "Sample Product",
        "price": "19.99",
        "description": "This is a sample product description.",
        "category": "Sample Category",
        "stock_quantity": 100,
        "created_at": "2023-10-25T15:59:05.220Z",
        "updated_at": "2023-10-25T15:59:05.220Z"
      }
    ];

    axiosConfig.data = requestBody;

    const response = await axios.request(axiosConfig);
    const { status, message } = response.data;

    expect(status).toEqual(201);
    expect(message).toEqual(`Insert success`);
  });

  it('Should return data match with request when insert many', async () => {
    const requestBody = [{
      "name": "Sample Product 1",
      "price": "20000.00",
    },
    {
      "name": "Sample Product 2",
      "price": "19.99",
    }];

    axiosConfig.data = requestBody;

    const response = await axios.request(axiosConfig);
    const { status } = response.data;

    expect(status).toEqual(201);
  });

  it('Should return status 615 when data insert not have same key each object', async () => {
    const requestBody = [{
      "name": "Sample Product 1",
      "price": "20000.00",
      "description": "This is a sample product description.",
    },
    {
      "name": "Sample Product 2",
      "price": "19.99",
    }];

    axiosConfig.data = requestBody;

    const response = await axios.request(axiosConfig);
    const { status, message } = response.data;

    expect(status).toEqual(615);
    expect(message).toEqual(`Can not insert new record into app_9999_products in 9999 because data insert not have same key each object`);
  });

  it('Should return status 613 when data insert conflict constraint database', async () => {
    // Product price should not be empty
    const requestBody = [{
      "name": "Sample Product 1",
    }];

    axiosConfig.data = requestBody;

    const response = await axios.request(axiosConfig);
    const { status } = response.data;
    expect(status).toEqual(613);
  });

  it('Should return status 616 when data insert empty', async () => {
    const requestBody = [];
    axiosConfig.data = requestBody;

    const response = await axios.request(axiosConfig);
    const { status } = response.data;
    expect(status).toEqual(616);
  });

  it('Should return status 617 when attribute of request do not match attribute in table database', async () => {
    const requestBody = [{
      "name": "Sample Product 1",
      "price": "19.99",
      "wrong_attribute": "wrong_attribute"
    }];
    axiosConfig.data = requestBody;
    const response = await axios.request(axiosConfig);
    const { status } = response.data;
    expect(status).toEqual(617);
  });

  it('Should return status 619 when data insert is not an array object', async () => {
    const requestBody = undefined;
    axiosConfig.data = requestBody;
    const response = await axios.request(axiosConfig);
    const { status } = response.data;
    expect(status).toEqual(619);
  });
})
