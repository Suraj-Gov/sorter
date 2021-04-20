import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda";
import db from "../lib/db";

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
      const data = await db.query("SELECT * FROM visitors", []);
      console.log(data.rows);
      const response: Response = {
        body: JSON.stringify(data.rows[0]),
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
