
export interface IEncryptedColumnOptions {
  key: string;
  algorithm: string;
  ivLength: number;
  iv?: string;    //// For testing mainly.
}
