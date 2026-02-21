import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Role } from '@/common/enums/role.enum';
import { BaseEntity } from '@/common/utils/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  login: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  isDeleted?: Nullable<Date>;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: Nullable<string>;
}
