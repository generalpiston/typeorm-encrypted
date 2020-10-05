import { createConnection, Connection } from "typeorm";

import { AutoEncryptSubscriber } from "../src/subscribers";

let CONNECTION: Connection;
let LOCK = false;

export async function getConnection(): Promise<Connection> {
  try {
    while (LOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    LOCK = true;

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

    return CONNECTION;
  } finally {
    LOCK = false;
  }
}
