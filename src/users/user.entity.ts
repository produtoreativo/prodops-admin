import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenEntity } from '../auth/token.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column({
    nullable: true,
  })
  name: string;
  @Column({
    nullable: true,
  })
  @Exclude()
  password: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];
  @ManyToOne(() => Organization, (organization) => organization.members)
  organization: Organization;
  @OneToMany(() => Organization, (organization) => organization.owner)
  organizations: Organization[];
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
