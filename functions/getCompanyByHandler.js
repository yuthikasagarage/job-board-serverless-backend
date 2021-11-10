import AWS from "aws-sdk";
import schema from "./schema/getCompanyByHandler.schema";
import createHeaders from "../shared/createHeaders";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, callback) => {
  const { companyHandler } = event.pathParameters;

  const { error } = schema.validate({ companyHandler });

  if (error) {
    return callback(null, {
      statusCode: 401,
      headers: createHeaders(),
      body: JSON.stringify({ success: false, error }),
    });
  }

  try {
    const params = {
      TableName: process.env.companyTableName,
      IndexName: "byCompanyHandler",
      KeyConditionExpression: "companyHandler = :companyHandler",
      ExpressionAttributeValues: {
        ":companyHandler": companyHandler,
      },
    };

    const result = await dynamoDB.query(params).promise();
    return callback(null, {
      statusCode: 200,
      headers: createHeaders(),
      body: JSON.stringify({
        statusCode: 200,
        data: result.Items,
      }),
    });
  } catch (error) {
    console.log(error);
    return callback(null, {
      statusCode: 500,
      headers: createHeaders(),
      body: JSON.stringify({ success: false, error }),
    });
  }
};
