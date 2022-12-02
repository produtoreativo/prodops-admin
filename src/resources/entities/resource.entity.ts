import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Provider } from '../../providers/entities/provider.entity';
import { Scan } from '../../scans/entities/scan.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'json' })
  scanContent: Record<string, any>;

  @ManyToOne(() => Organization, (org) => org.resources)
  organization: Organization;

  @ManyToOne(() => Provider, (prov) => prov.resources)
  provider: Provider;

  // bi-directional relations

  @ManyToMany(() => Scan, (scan) => scan.resources)
  scans: Scan[];
}
