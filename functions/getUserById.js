import createHeaders from "../shared/createHeaders";
import schema from "./schema/getUserById.schema";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, callback) => {
  const { userId } = event.pathParameters;

  const { error } = schema.validate({ userId });

  if (error) {
    return callback(null, {
      statusCode: 401,
      headers: createHeaders(),
      body: JSON.stringify({ success: false, error }),
    });
  }

  try {
    const params = {
      TableName: process.env.userTableName,
      Key: {
        id: userId,
      },
    };

    const result = await dynamoDB.get(params).promise();

    return callback(null, {
      statusCode: 200,
      headers: createHeaders(),
      body: JSON.stringify({
        statusCode: 200,
        data: result.Item,
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
