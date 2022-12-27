import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

export enum TokenType {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@Entity({ name: 'tokens' })
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  token: string;
  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;
  @Column()
  expiresAt: Date;
  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user: UserEntity;
}
