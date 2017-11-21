
import { MetadataStorage } from "./MetadataStorage";

export * from "./IEncryptedColumnMetadata";
export { MetadataStorage };

export function getGlobalVariable(): any {
  return global;
}

export function getMetadataStorage(): MetadataStorage {
  let globalScope = getGlobalVariable();

  if (!globalScope.metadataStorage) {
    globalScope.metadataStorage = new MetadataStorage();
  }
  
  return globalScope.metadataStorage;
}
