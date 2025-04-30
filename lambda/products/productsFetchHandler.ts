import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

import { ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";

const productsDdb = process.env.PRODUCTS_DDB!;
const ddbClient = new DynamoDB.DocumentClient();
const productRepository = new ProductRepository(ddbClient, productsDdb);

export async function handler(
  event: APIGatewayProxyEvent,
  ctx: Context
): Promise<APIGatewayProxyResultV2> {
  const apiRequestId = event.requestContext.requestId;
  const method = event.httpMethod;
  const lambdaRequestId = ctx.awsRequestId;

  console.log({
    apiRequestId,
    lambdaRequestId,
  });

  // "/products"
  if (event.resource === "/products") {
    if (method === "GET") {
      console.log("ProductsFetchHandler - /products");

      const products = await productRepository.getAll();

      return {
        statusCode: 200,
        body: JSON.stringify(products),
      };
    }
  }

  // "/products/{id}"
  if (event.resource === "/products/{id}") {
    if (method === "GET") {
      const id = event.pathParameters!.id as string;

      console.log(`ProductsFetchHandler - /products/${id}`);

      try {
        const product = await productRepository.getById(id);

        return {
          statusCode: 200,
          body: JSON.stringify(product),
        };
      } catch (error) {
        console.error((<Error>error).message);
        return {
          statusCode: 404,
          body: (<Error>error).message,
        };
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
