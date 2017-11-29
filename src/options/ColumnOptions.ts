import { ColumnOptions } from "typeorm";
import { EncryptionOptions } from "./EncryptionOptions";

/**
 * Use interface merging to add encryption options.
 *
 * @see https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
export interface ColumnOptions {
  /**
   * Specifies how to encrypt column.
   */
  encrypt?: EncryptionOptions;   
}
