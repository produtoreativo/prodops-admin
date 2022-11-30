import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: 'json' })
  public scanContent: JSON;

  @Column()
  public organizationId: number;

  @Column()
  public scanId: number;

  @Column()
  public providerId: number;

  @Column()
  public resourceViewId: number;
}
