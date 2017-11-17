
import { MetadataStorage } from "./MetadataStorage";

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
