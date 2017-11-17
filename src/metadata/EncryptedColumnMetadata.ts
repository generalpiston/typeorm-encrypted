
import { EncryptedColumnOptions } from "../decorators/options/EncryptedColumnOptions";

export interface EncryptedColumnMetadata {
  /**
   * Class to which column is applied.
   */
  readonly target: Function|string;

  /**
   * Class's property name to which column is applied.
   */
  readonly propertyName: string;

  /**
   * Extra column options.
   */
  readonly options: EncryptedColumnOptions;
}