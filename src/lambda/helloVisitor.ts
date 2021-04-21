import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda";
import prismaClient from "../lib/db";

interface Response {
  statusCode: number;
  body: string;
}

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  const fetchData = async () => {
    try {
      const allVisitors = await prismaClient.visitors.findMany();
      const response: Response = {
        body: JSON.stringify(allVisitors),
        statusCode: 200,
      };
      callback(undefined, response);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
};

export { handler };
