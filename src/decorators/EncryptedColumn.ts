
import { EncryptedColumnOptions } from "./options/EncryptedColumnOptions";
import { getMetadataStorage } from "../metadata";

export function EncryptedColumn(options: EncryptedColumnOptions): Function {
  return function (object: Object, propertyName: string) {
    getMetadataStorage().encryptedColumns.push({
      target: object.constructor,
      propertyName: propertyName,
      options: options
    });
  };
}
