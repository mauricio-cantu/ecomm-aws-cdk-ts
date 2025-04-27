#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ECommerceApiStack } from "../lib/ecommerceApi-stack";
import { ProductsAppStack } from "../lib/productsApp-stack";

const app = new cdk.App();

const env: cdk.Environment = {
  account: "501879848224",
  region: "us-east-1",
};

const tags = {
  cost: "ECommerce",
  team: "Mauricio",
};

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags,
  env: env,
});

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env,
});

eCommerceApiStack.addDependency(productsAppStack);
