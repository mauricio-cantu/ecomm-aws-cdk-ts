import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";

export interface Product {
  id: string;
  // 'name' is a reserved keyword
  productName: string;
  code: string;
  price: number;
  model: string;
}

export class ProductRepository {
  private ddbClient: DocumentClient;
  private productsDdb: string;

  constructor(ddbClient: DocumentClient, productsDdb: string) {
    this.ddbClient = ddbClient;
    this.productsDdb = productsDdb;
  }

  async getAll(): Promise<Product[]> {
    const data = await this.ddbClient
      .scan({
        TableName: this.productsDdb,
      })
      .promise();

    return data.Items as Product[];
  }

  async getById(productId: string): Promise<Product> {
    const data = await this.ddbClient
      .get({
        TableName: this.productsDdb,
        Key: {
          id: productId,
        },
      })
      .promise();

    if (data.Item) {
      return data.Item as Product;
    }

    throw new Error("Product not found");
  }

  async create(product: Omit<Product, "id">): Promise<Product> {
    const newProduct: Product = {
      id: uuid(),
      ...product,
    };

    await this.ddbClient
      .put({
        TableName: this.productsDdb,
        Item: newProduct,
      })
      .promise();

    return newProduct;
  }

  async update(productId: string, product: Product): Promise<Product> {
    const data = await this.ddbClient
      .update({
        TableName: this.productsDdb,
        Key: {
          id: productId,
        },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "UPDATED_NEW",
        UpdateExpression:
          "set productName = :n, code = :c, price = :p, model = :m",
        ExpressionAttributeValues: {
          ":n": product.productName,
          ":c": product.code,
          ":p": product.price,
          ":m": product.model,
        },
      })
      .promise();

    return data.Attributes as Product;
  }

  async delete(productId: string): Promise<Product> {
    const data = await this.ddbClient
      .delete({
        TableName: this.productsDdb,
        Key: {
          id: productId,
        },
        // brings deleted item's attributes
        ReturnValues: "ALL_OLD",
      })
      .promise();

    if (data.Attributes) {
      return data.Attributes as Product;
    }

    throw new Error("Product not found");
  }
}
