import { createConnection, Connection } from "typeorm";
import { AutoEncryptSubscriber } from "../src/subscribers";

let CONNECTION: Connection;

export async function withConnection (callback: Function): Promise<any> {
  if (!CONNECTION) {
    CONNECTION = await createConnection({
      "type": "sqlite",
      "database": `/tmp/test.${process.pid}.sqlite`,
      "synchronize": true,
      "logging": false,
      "entities": [
        "**/entities/**/*.ts"
      ],
      "subscribers": [ AutoEncryptSubscriber ]
    });
  }
  return await Promise.resolve(callback(CONNECTION));
}
