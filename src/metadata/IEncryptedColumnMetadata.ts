
import { IEncryptedColumnOptions } from "../decorators/options/IEncryptedColumnOptions";

export interface IEncryptedColumnMetadata {
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
  readonly options: IEncryptedColumnOptions;
}