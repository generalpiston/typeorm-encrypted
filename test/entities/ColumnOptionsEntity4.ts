import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ExtendedColumnOptions } from "../../src/options";

@Entity()
export default class ColumnOptionsEntity4 extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "boolean" })
  enablePredicate: boolean;

  @Column(<ExtendedColumnOptions>{
    type: "varchar",
    nullable: false,
    encrypt: {
      key: "e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61",
      algorithm: "aes-256-cbc",
      ivLength: 16,
      iv: "ff5ac19190424b1d88f9419ef949ae56",
      encryptionPredicate: (entity: ColumnOptionsEntity4) =>
        entity.enablePredicate,
    },
  })
  secret: string;
}
