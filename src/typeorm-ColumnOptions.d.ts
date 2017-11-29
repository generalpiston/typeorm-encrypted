// Type definitions for typeorm
// Project: typeorm
// Definitions by: Abraham Elmahrek <abe@apache.org>

import { ColumnOptions } from "typeorm";
import { EncryptionOptions } from "./options/EncryptionOptions";

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
