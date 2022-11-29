import { Provider } from 'src/providers/entities/provider.entity';
import { Scan } from 'src/scans/entities/scan.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('resource-views')
export class ResourceView {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public arn: string;

  @Column()
  public providerId: number;

  @ManyToOne(() => Provider, (prov) => prov.resourceViews)
  provider: Provider;

  @OneToMany(() => Scan, (scan) => scan.resourceView)
  scans: Scan[];

}
