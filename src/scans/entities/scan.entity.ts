import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResourceView } from 'src/resource-views/entities/resource-view.entity';
import { Provider } from '../../providers/entities/provider.entity';
import { Resource } from '../../resources/entities/resource.entity';

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Provider, (provider) => provider.scans)
  provider: Provider;

  @ManyToOne(() => ResourceView, (resourceView) => resourceView.scans)
  resourceView: ResourceView;

  @ManyToMany(() => Resource, (resource) => resource.scans, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({ name: 'scans_has_resources' })
  resources: Resource[];
}
