import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk";
import * as AWSXray from "aws-xray-sdk";

AWSXray.captureAWS(require("aws-sdk"));

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
    if (method === "POST") {
      console.log("ProductsAdminHandler - POST /products");

      const product = JSON.parse(event.body!) as Product;

      const newProduct = await productRepository.create(product);

      return {
        statusCode: 201,
        body: JSON.stringify(newProduct),
      };
    }
  }

  // "/products/{id}"
  if (event.resource === "/products/{id}") {
    if (method === "PUT") {
      const id = event.pathParameters!.id as string;
      console.log(`ProductsAdminHandler - PUT /products/${id}`);

      const product = JSON.parse(event.body!) as Product;

      try {
        const updatedProduct = await productRepository.update(id, product);
        return {
          statusCode: 200,
          body: JSON.stringify(updatedProduct),
        };
      } catch (error) {
        return {
          statusCode: 404,
          body: "Product not found",
        };
      }
    }

    if (method === "DELETE") {
      const id = event.pathParameters!.id as string;

      console.log(`ProductsAdminHandler - DELETE /products/${id}`);

      try {
        const deletedProduct = await productRepository.delete(id);
        return {
          statusCode: 200,
          body: JSON.stringify(deletedProduct),
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
