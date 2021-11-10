import AWS from 'aws-sdk';
import schema from './schema/getJobsByCompanyHandler.schema';
import createHeaders from '../shared/createHeaders';

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
        // params for find companyId from company-table using company-handler
        const companyParams = {
            TableName: process.env.companyTableName,
            IndexName: "byCompanyHandler",
            KeyConditionExpression: "companyHandler = :companyHandler",
            ExpressionAttributeValues: {
                ":companyHandler": companyHandler,
            },
        };

        const company = await dynamoDB.query(companyParams).promise();

        // params for find companyId from job-table using companyId
        const jobParams = {
            TableName: process.env.jobTableName,
            IndexName: "byCompanyId",
            KeyConditionExpression: "companyId = :companyId",
            ExpressionAttributeValues: {
                ":companyId": company.Items[0].id,
            },
        };

        const result = await dynamoDB.query(jobParams).promise();

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