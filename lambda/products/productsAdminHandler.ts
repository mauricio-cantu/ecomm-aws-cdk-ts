import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

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

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "ProductsAdminHandler - POST /products",
        }),
      };
    }
  }

  // "/products/{id}"
  if (event.resource === "/products/{id}") {
    if (method === "PUT") {
      const id = event.pathParameters!.id as string;

      console.log(`ProductsAdminHandler - PUT /products/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `ProductsAdminHandler - PUT /products/${id}`,
        }),
      };
    }

    if (method === "DELETE") {
      const id = event.pathParameters!.id as string;

      console.log(`ProductsAdminHandler - DELETE /products/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `ProductsAdminHandler - DELETE /products/${id}`,
        }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
