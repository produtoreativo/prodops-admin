import { Provider } from 'src/providers/entities/provider.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public name: string;

  @OneToMany(() => Provider, (provider) => provider.organization)
  providers: Provider[]
 
}
