import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {

  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public name: string;
 
  @Column()
  public content: string;

}