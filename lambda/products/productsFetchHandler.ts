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

  if (event.resource === "/products") {
    if (method === "GET") {
      console.log("ProductsFetchHandler - GET");

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Get Products - OK",
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
