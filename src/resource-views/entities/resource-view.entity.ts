import { Provider } from 'src/providers/entities/provider.entity';
import { Scan } from 'src/scans/entities/scan.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
