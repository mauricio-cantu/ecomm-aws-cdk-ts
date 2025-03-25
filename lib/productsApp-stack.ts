import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
  readonly productsFetchHandler: lambdaNode.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.productsFetchHandler = new lambdaNode.NodejsFunction(
      this,
      "ProductsFetchHandler",
      {
        functionName: "ProductsFetchHandler",
        entry: "lambda/products/fetchHandler.ts",
        handler: "handler",
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 512,
        timeout: cdk.Duration.seconds(5),
        bundling: {
          minify: true,
          sourceMap: false,
        },
      }
    );
  }
}
