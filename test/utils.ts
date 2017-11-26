import { createConnection } from "typeorm";

export async function withConnection (entities: any[], listeners: any[], subscribers: any[], callback: Function): Promise<any> {
  let connection = await createConnection({
    "type": "sqlite",
    "database": `/tmp/test.${process.pid}.sqlite`,
    "synchronize": true,
    "logging": false,
    "entities": entities,
    "subscribers": subscribers
  });
  let result = await Promise.resolve(callback(connection));
  connection.close();

  return result;
}
