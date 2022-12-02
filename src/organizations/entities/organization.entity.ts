import { Provider } from 'src/providers/entities/provider.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => Provider, (provider) => provider.organization)
  providers: Provider[];

  @OneToMany(() => Resource, (resource) => resource.organization)
  resources: Resource[];
}
