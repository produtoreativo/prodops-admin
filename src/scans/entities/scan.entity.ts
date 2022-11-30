import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceView } from 'src/resource-views/entities/resource-view.entity';
import { Provider } from '../../providers/entities/provider.entity';

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public providerId: number;

  @ManyToOne(() => Provider, (provider) => provider.scans)
  provider: Provider;

  @ManyToOne(() => ResourceView, (resourceView) => resourceView.scans)
  resourceView: ResourceView;
}
