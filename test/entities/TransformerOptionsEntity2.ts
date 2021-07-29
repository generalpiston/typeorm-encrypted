import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { EncryptionTransformer } from "../../src/transformer";

@Entity()
export default class TransformerOptionsEntity2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: "e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61",
      algorithm: "aes-256-cbc",
      ivLength: 16,
      iv: "ff5ac19190424b1d88f9419ef949ae56",
    }),
  })
  secret: string;
}
