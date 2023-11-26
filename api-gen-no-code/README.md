> SQL TO API - NESTJS

## 🚩 Table of Contents

1. [About the Project](#about-project)
2. [Installation](#installation)
3. [How to Create API from SQL?](#how-create-api-from-sql)
4. [Request / Response Syntax](#request-syntax)
5. [Integrate with Your Existing System](#integrate-with-your-existing-system)
6. [Use as a Backend for SPA (Single Page Application)](#use-as-a-backend-for-spa-single-page-application)
7. [Use as Core System - Adding Additional Modules](#use-as-core-system---adding-additional-modules)
8. [Contributing](#-contributing)

# About the Project:

# Installation:

## Prerequisites

Before you begin, please make sure you have Node.js version 18.16.1 installed on your system. You can download it from the official [Node.js website](https://nodejs.org/).

To verify if you have the correct version installed, open a terminal or command prompt and run the following command:

```bash
node -v
```

This should display the version of Node.js you have installed. If it does not show **v18.16.1**, please download and install the correct version.

If you need to manage multiple versions of Node.js, consider using a version manager like nvm (Node Version Manager) or n.

Once you have Node.js v18.16.1 installed, you're ready to proceed with the installation of this project.

## Getting Started

### Clone the Repository

To get started with the project, you'll need to clone this repository to your local machine. Open a terminal or command prompt and run the following command:

```bash
  git clone https://github.com/khaphan-github/api-gen-no-code
```

Then cd to project

```bash
  cd api-gen-no-code
```

Then remember checkout branch **feature/sql-to-api** if you want to use feature **sql-to-api**:

```bash
  git checkout feature/sql-to-api
```

### Install necessary package:

```
  npm install
```
# How to Create API from SQL:

Now you can open this project using vscode, then you need to find `/apps/interated/src/assets` folder where store your database connection and sql script:
![image](https://github.com/khaphan-github/api-gen-no-code/assets/76431966/4a11b73f-3993-43b1-bf9e-8832b6924008)

### You provice database connection in `connection.json` file:
```json
{
  "type": "postgres",
  "host": "",
  "port": "5432",
  "username": "",
  "password": "",
  "database": ""
}
```
- `type` must be "postgres" because this source code only support postgresql
- `host` you can insert your hostname (ex: localhost) or use any cloud db provide postgresql service
- `port` by default postgresql using port `5432`
- `username` username to connect to this database
- `password` password to connect to this database 
- `database` this is database name by default postgresql provide database name `public`

### Now you insert your sql script to create database to `database.sql` file:
```sql
-- Example with create product table in postgresql
CREATE TABLE
    products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        stock_quantity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```

### Nice! Now run this project
To run this project you need to make sure that your are in root project - where found `project.json` file:
```
cd apps/interated
```
![image](https://github.com/khaphan-github/api-gen-no-code/assets/76431966/c4c7615a-19fd-4af8-8601-caa1c43f02fc)

Now run project you run this command:
```bash
npx nx serve
```
If every things work right, you will see your terminal like this:
![image](https://github.com/khaphan-github/api-gen-no-code/assets/76431966/415c366c-b199-46d7-9381-153fe83818db)

### Now you check your database:

If you found 3 `_code...` table and your table - every thing worked.

![image](https://github.com/khaphan-github/api-gen-no-code/assets/76431966/439b30d9-0b63-4fc4-94e6-266417dbcb75)

# Request / Response Syntax:
## Request:

In this project I use RESTFull APIs, RESTful (Representational State Transfer) APIs are a type of web service that adhere to a set of architectural principles. They are designed to enable communication between different software systems over the internet.

Basic Operations in RESTful APIs

- GET: Retrieves data from the server. It should not have any side effects on the server.
- POST: Creates new data on the server. It may change the server's state.
- PUT: Updates existing data on the server. It should be idempotent, meaning multiple identical requests have the same effect as a single request.
- DELETE: Removes data from the server.

Follow this format I create API to query your table:

### Request format:

This is an example for an api create product, we have an sql script to create product table:

```sql
-- This is script create table products in postgresql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    stock_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

We have format endpoint **domain/app/THIS_IS_APP_ID/schema/THIS_IS_SCHEMA_NAME**, follow this example we have an endpoint:

```
http://localhost:3000/app/9999/schema/products'
```

- **domain**: This represents the base domain or address of the API server (e.g., http://localhost:3000).

- **app**: This is a placeholder for the application segment.

- **THIS_IS_APP_ID**: This is a variable segment for the application ID. In this case, 9999 is given as an example. It suggests that 9999 is the default application ID, and it may not require modification.

- **schema**: This is a placeholder for the schema segment.

- **THIS_IS_SCHEMA_NAME**: This is a variable segment for the schema name. In the provided example, it's products, indicating that the endpoint is related to the products table.

### POST - Create one or more record:

Follow this example we need to prepare some things to create a http request to create a new record:
All request to create a new record follow this syntax:

1. Endpoint:

```
http://localhost:3000/app/9999/schema/REPLACE_WITH_YOUR_TABLE'

EX: http://localhost:3000/app/9999/schema/products
```

2. Method: [POST]
3. Request body:
   **NOTE:**
   - Attribute in body need to match with attribute in table you created.
   - You can create many record

```
[
  {
    "product_id": 1,
    "name": "Sample Product",
    "price": 19.99,
    "description": "This is a sample product description.",
    "category": "Sample Category",
    "stock_quantity": 100,
    "created_at": "2023-10-25T15:59:05.220Z",
    "updated_at": "2023-10-25T15:59:05.220Z"
  }
]
```

4. Example request using `axios`(https://axios-http.com/vi/docs/intro):

```javascript
const axios = require('axios');
const apiUrl = 'http://localhost:3000/app/9999/schema/products';

const requestBody = [
  {
    product_id: 1,
    name: 'Sample Product',
    price: 19.99,
    description: 'This is a sample product description.',
    category: 'Sample Category',
    stock_quantity: 100,
    created_at: '2023-10-25T15:59:05.220Z',
    updated_at: '2023-10-25T15:59:05.220Z',
  },
];

axios
  .post(apiUrl, requestBody)
  .then((response) => {
    console.log('Product created successfully:', response.data);
  })
  .catch((error) => {
    console.error('Error creating product:', error);
  });
```

5. Example response:

```json
{
  "id": "5519ba5d-ebf1-4271-9071-cec729c0e403",
  "timestamp": "2023-10-25T16:52:22.884Z",
  "apiVersion": "2.0",
  "status": 201,
  "message": "Insert success",
  "data": [
    {
      "product_id": 1,
      "name": "Sample Product",
      "price": "19.99",
      "description": "This is a sample product description.",
      "category": "Sample Category",
      "stock_quantity": 100,
      "created_at": "2023-10-25T15:59:05.220Z",
      "updated_at": "2023-10-25T15:59:05.220Z"
    }
  ]
}
```

### POST - Execute complex query:

You can query every thing you want when use this endpoint:

1. Endpoint:

```
http://localhost:3000/app/9999/schema/products/query
```

2. Method: [POST]

3. Example request using `axios`(https://axios-http.com/vi/docs/intro):

I recommend use an interface for condition:

```typescript
export interface ConditionObject {
  and?: ConditionObject[];
  or?: ConditionObject[];
  [key: string]: string | ConditionObject[] | undefined;
}
```

```javascript
import axios from 'axios';

const url = 'http://localhost:3000/app/9999/schema/products/query';
const params = {
  selects: ['product_id', 'name'],
  page: 0,
  size: 10,
  orderby: 'product_id',
  caching: false,
};

// caching not implemented;

const conditionObject: ConditionObject = {
  or: [{ category: 'Sample Category' }, { name: 'Sample Product' }],
};

axios
  .post(
    url,
    conditionObject,
    {
      params,
    }
  )
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### PUT - Update a record:

To update a record in table you could call this endpoint:

1. Endpoint:

```
http://localhost:3000/app/9999/schema/products/1?id_column=product_id
```

**NOTE**: id_column=product_id is primary key column in your table

2. Method: [PUT]

3. Example request using `axios`(https://axios-http.com/vi/docs/intro):
4. Request body:

```json
{
  "product_name": " Update product name",
  "description": "Update product desc"
}
```

```javascript
const axios = require('axios');

const url = 'http://localhost:3000/app/9999/schema/products/4?id_column=product_id';

const data = {
  product_name: 'Update product name',
  description: 'Update product desc',
};

axios
  .put(url, data, { headers })
  .then((response) => {
    console.log('Product updated successfully');
  })
  .catch((error) => {
    console.error('Error updating product:', error);
  });
```

5. Example response:

```json
{
  "id": "30b40a21-c296-4d2b-94fd-02892975b080",
  "timestamp": "2023-10-26T08:58:59.283Z",
  "apiVersion": "2.0",
  "status": 200,
  "message": "Update success",
  "data": [
    {
      "product_id": 1,
      "name": "Update product name", // <-- Updated value
      "price": "19.99",
      "description": "Update product desc", // <-- Updated value
      "category": "Sample Category",
      "stock_quantity": 100,
      "created_at": "2023-10-25T15:59:05.220Z",
      "updated_at": "2023-10-25T15:59:05.220Z"
    }
  ]
}
```

### DELETE - Remove a record:

You can delete a record in by this enpoint:

1. Endpoint:

```
http://localhost:3000/app/9999/schema/products/1?id_column=product_id
```

**NOTE**: id_column=product_id is primary key column in your table 2. Method: [DELETE]

3. Example request using `axios`(https://axios-http.com/vi/docs/intro):

```javascript
const axios = require('axios');

const productId = 1; // This is the ID of the product you want to delete
const url = 'http://localhost:3000/app/9999/schema/products/' + productId + '?id_column=product_id';

axios
  .delete(url)
  .then((response) => {
    console.log('Product deleted successfully');
  })
  .catch((error) => {
    console.error('Error deleting product:', error);
  });
```

4. Example response: Delete method will response with http status cod 204 with no content:

### GET - Get api document:

You can get api document by json in this endpoint:

1. Endpoint:

```
http://localhost:3000/generator/app/9999/api
```

2. Method: [GET]

3. Example request using `axios`(https://axios-http.com/vi/docs/intro):

```javascript
const axios = require('axios');
const apiUrl = 'http://localhost:3000/generator/app/9999/api';

axios
  .get(apiUrl)
  .then((response) => {
    console.log('Product created successfully:', response.data);
  })
  .catch((error) => {
    console.error('Error creating product:', error);
  });
```

4. Example response:

```json
{
  "id": "f164e625-529e-42f1-a462-cf62f77018aa",
  "timestamp": "2023-10-26T07:22:50.258Z",
  "apiVersion": "2.0",
  "status": 200,
  "message": "Get apis by 9999 success",
  "data": [
    {
      "id": 1,
      "app_id": 9999,
      "table_name": "products",
      "action": "INSERT",
      "api_path": "/api/v1/app/9999/schema/products",
      "http_method": "POST",
      "authentication": "NO_AUTH",
      "api_authorized": null,
      "headers": {
        "AppClientSecretKey": "secret_kkey"
      },
      "request_params": null,
      "request_body_type": null,
      "request_body": [
        {
          "name": "your_data",
          "price": "your_data",
          "category": "your_data",
          "created_at": "your_data",
          "product_id": "your_data",
          "updated_at": "your_data",
          "description": "your_data",
          "stock_quantity": "your_data"
        }
      ],
      "response_attributes": [
        {
          "name": "your_data",
          "price": "your_data",
          "category": "your_data",
          "created_at": "your_data",
          "product_id": "your_data",
          "updated_at": "your_data",
          "description": "your_data",
          "stock_quantity": "your_data"
        }
      ],
      "enable": true,
      "created_at": "2023-10-25T16:50:02.000Z",
      "updated_at": "2023-10-25T16:50:02.000Z"
    }
    //...//
  ]
}
```

### How query with relationship;

## Response:

### API Response Format:

Every API in this project follows a standardized response format. The response is in JSON format and consists of the following fields:

- `id` (string): A unique identifier for the response.
- `timestamp` (string, ISO 8601 format): The timestamp when the response was generated.
- `apiVersion` (string): The version of the API that generated the response.
- `status` (number): The HTTP status code indicating the result of the API call.
- `message` (string): A message from the server providing additional information about the response.
- `data` (any): The main payload of the response, which can be of any type.

Here is an example of a response in this format:

```json
{
  "id": "de50a802-4ba5-4594-a5bd-3c5cb3df0e27",
  "timestamp": "2023-10-25T15:59:05.220Z",
  "apiVersion": "2.0",
  "status": 200,
  "message": "Message from server",
  "data": {
    // ... (any data relevant to the specific API)
  }
}
```

To ensure seamless integration with the standardized API response format, it's recommended to create an interface in your codebase. This interface will represent the structure of the API response.

If you're using TypeScript, you can create an interface like this:

```typescript
interface ApiResponse<T> {
  id: string;
  timestamp: string;
  apiVersion: string;
  status: number;
  message: string;
  data: T;
}
```

### Error code:

You can use error code to handle ui if error when call api:
| Index | Status | Description |
| ----- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1 | 600 | DefaultResponseError - Server error|
| 2 | 610 | CanNotDeleteResultError |
| 3 | 611 | CanNotExecuteQueryError
| 4 | 612 | CanNotGetAppInforError |
| 5 | 613 | CanNotInsertNewRecordError |
| 6 | 614 | CanNotUpdateResultError |
| 7 | 615 | DataToInsertNotHaveSameKeyError |
| 8 | 616 | EmptyRecordWhenInsertError |
| 9 | 617 | InvalidColumnOfTableError |
| 10 | 618 | NotFoundAppByIdError |


### Success code:

You can use error code to handle ui if user do some things success:
| Index | Status | Description |
| ----- | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1 | 200 | Success status response code indicates that the request has succeeded when get or update data |
| 2 | 201 | Success status response code indicates that the request has succeeded and has led to the creation of a resource |
| 3 | 204 | Success status response code indicates that the request has succeeded when deleted data|

# Integrate with Your Existing System

# Use as a Backend for SPA (Single Page Application):

# Use as Core System - Adding Additional Modules:

# Contributing
