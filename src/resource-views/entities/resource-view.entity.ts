import { Provider } from 'src/providers/entities/provider.entity';
import { Scan } from 'src/scans/entities/scan.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';

@Entity('resource-views')
export class ResourceView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  arn: string;

  @ManyToOne(() => Provider, (prov) => prov.resourceViews)
  provider: Provider;

  @OneToMany(() => Scan, (scan) => scan.resourceView)
  scans: Scan[];

  @ManyToMany(() => Resource, (resource) => resource.resourceViews)
  @JoinTable({ name: 'resources_views_has_resources' })
  resources: Resource[];
}
