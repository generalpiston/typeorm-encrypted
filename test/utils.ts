import { DataSource } from "typeorm";

import { AutoEncryptSubscriber } from "../src/subscribers";

let CONNECTION: DataSource;
let LOCK = false;

export async function getConnection(): Promise<DataSource> {
  try {
    while (LOCK) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    LOCK = true;

    if (!CONNECTION) {
      CONNECTION = await new DataSource({
        "type": "better-sqlite3",
        "database": `/tmp/test.${process.pid}.sqlite`,
        "synchronize": true,
        "logging": false,
        "entities": [
          "**/entities/**/*.ts"
        ],
        "subscribers": [ AutoEncryptSubscriber ]
      }).initialize();
    }

    return CONNECTION;
  } finally {
    LOCK = false;
  }
}
