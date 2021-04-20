import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda";

interface Response {
  statusCode: number;
  body: string;
}

const handler: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback
) => {
  console.log("hello");
  const params = event.queryStringParameters;
  const response: Response = {
    body: JSON.stringify({
      message: "hello",
    }),
    statusCode: 200,
  };

  callback(undefined, response);
};

export { handler };
