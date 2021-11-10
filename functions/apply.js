import createHeaders from "../shared/createHeaders";
import schema from "./schema/apply.schema";
import AWS from "aws-sdk";
import mail from "@sendgrid/mail";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context, callback) => {
  mail.setApiKey(process.env.SEND_GRID_MAIL_API_KEY);
  const items = JSON.parse(event.body);
  const { error } = schema.validate(items);

  if (error) {
    console.log({ error });
    return callback(null, {
      statusCode: 401,
      headers: createHeaders(),
      body: JSON.stringify({ success: false, error }),
    });
  }

  try {
    const params = {
      TableName: process.env.candidateTableName,
      Item: {
        ...items,
        handlers: [
          `${items.companyId}adminON_TRIAL`,
          `${items.companyId}managerON_TRIAL`,
          `${items.companyId}adminON_SUBSCRIPTION`,
          `${items.companyId}managerON_SUBSCRIPTION`,
        ],
      },
    };

    const result = await dynamoDB.put(params).promise();

    try {
      const managerParams = {
        TableName: process.env.userTableName,
        Key: {
          id: items.managerInCharge,
        },
      };

      const jobParams = {
        TableName: process.env.jobTableName,
        Key: {
          id: items.jobId,
        },
      };

      const managerResult = await dynamoDB.get(managerParams).promise();
      const jobResult = await dynamoDB.get(jobParams).promise();
      const url = {
        "devtesting": `http://localhost:3000`,
        "next": process.env.qaLink,
        "prod": ""
      };
      const email = {
        to: managerResult.Item.email,
        from: {
          email: `no-reply@${
            process.env.stage !== "prod" ? process.env.stage + "-" : null
          }reply.hellomolly.io`,
          name: `Molly`,
        },
        subject: `${items.firstName} has applied for ${jobResult.Item.title}`,
        text: `Hi ${managerResult.Item.firstName},
        You have received a new application. Please go to {direct url to candidate view} to manage
        Happy hiring!
        Team Molly`,
        html: `
        <div>
        <p>Hi ${managerResult.Item.firstName},</p>
        <p>You have received a new application. Please go to <a href=${url[process.env.stage]}/candidate/${items.id}/${items.jobId}>dashboard</a> to manage</p>
        <p>Happy hiring!</p>
        <p>Team Molly</p></div>`,
      };
      await mail.send(email);
    } catch (error) {
      console.log("mail-send-error: ", error.response.body);
    }
    return callback(null, {
      statusCode: 200,
      headers: createHeaders(),
      body: JSON.stringify({
        statusCode: 200,
        data: result,
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
