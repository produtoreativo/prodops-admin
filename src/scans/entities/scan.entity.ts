import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceView } from 'src/resource-views/entities/resource-view.entity';

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public providerId: number;

  @ManyToOne(() => ResourceView, (resourceView) => resourceView.scans)
  resourceView: ResourceView;
}
