import { ColumnOptions } from "typeorm";
import { EncryptionOptions } from "./EncryptionOptions";

export interface ExtendedColumnOptions extends ColumnOptions {
  encrypt?: EncryptionOptions
}