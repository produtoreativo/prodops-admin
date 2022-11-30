import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { ResourceView } from 'src/resource-views/entities/resource-view.entity';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  content: string;

  @Column({ type: 'json' })
  credentials: Record<string, any>;

  @ManyToOne(() => Organization, (org) => org.providers)
  organization: Organization;

  @OneToMany(() => ResourceView, (resourceView) => resourceView.provider)
  resourceViews: ResourceView[];
}
