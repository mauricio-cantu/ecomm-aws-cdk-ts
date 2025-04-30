#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ECommerceApiStack } from "../lib/ecommerceApi-stack";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { ProductsAppLayersStack } from "../lib/productsAppLayers-stack";

const app = new cdk.App();

const env: cdk.Environment = {
  account: "501879848224",
  region: "us-east-1",
};

const tags = {
  cost: "ECommerce",
  team: "Mauricio",
};

const productsAppLayersStack = new ProductsAppLayersStack(
  app,
  "productsAppLayers",
  {
    tags,
    env,
  }
);

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags,
  env,
});

productsAppStack.addDependency(productsAppLayersStack);

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags,
  env,
});

eCommerceApiStack.addDependency(productsAppStack);
