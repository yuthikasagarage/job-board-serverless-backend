import createHeaders from "../shared/createHeaders";
import schema from "./schema/getByCompanyId.schema";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, callback) => {
  const { companyId } = event.pathParameters;

  const { error } = schema.validate({ companyId });

  if (error) {
    return callback(null, {
      statusCode: 401,
      headers: createHeaders(),
      body: JSON.stringify({ success: false, error }),
    });
  }

  try {
    const params = {
      TableName: process.env.jobTableName,
      IndexName: "byCompanyId",
      KeyConditionExpression: "companyId = :companyId",
      ExpressionAttributeValues: {
        ":companyId": companyId,
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
