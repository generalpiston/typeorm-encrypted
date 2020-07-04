export interface EncryptionOptions {
  key: string;
  algorithm: string;
  ivLength: number;
  iv?: string;    //// For testing mainly.
  authTagLength?: number;
  looseMatching?: boolean;
}
