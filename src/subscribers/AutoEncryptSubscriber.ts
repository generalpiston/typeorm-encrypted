import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent
} from 'typeorm';
import { encrypt, decrypt } from '../entity';

@EventSubscriber()
export class AutoEncryptSubscriber implements EntitySubscriberInterface {
  /**
   * Encrypt before insertion.
   */
  beforeInsert(event: InsertEvent<any>): void {
    encrypt(event.entity);
  }

  /**
   * Encrypt before update.
   */
  beforeUpdate(event: UpdateEvent<any>): void {
    encrypt(event.entity);
  }

  /**
   * Decrypt after find.
   */
  afterLoad(entity: any): void {
    decrypt(entity);
  }
}
