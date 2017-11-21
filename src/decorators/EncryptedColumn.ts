
import { IEncryptedColumnOptions } from "./options/IEncryptedColumnOptions";
import { getMetadataStorage } from "../metadata";

export function EncryptedColumn(options: IEncryptedColumnOptions): Function {
  return function (object: Object, propertyName: string) {
    getMetadataStorage().encryptedColumns.push({
      target: object.constructor,
      propertyName: propertyName,
      options: options
    });
  };
}
