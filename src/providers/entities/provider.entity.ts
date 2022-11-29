import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { ResourceView } from 'src/resource-views/entities/resource-view.entity';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public content: string;

  @Column({ type: 'json' }) 
  public credentials: JSON;

  @Column()
  public organizationId: number;

  @ManyToOne(() => Organization, (org) => org.providers)
  organization: Organization;

  @OneToMany(() => ResourceView, (resourceView) => resourceView.provider)
  resourceViews: ResourceView[]

}
