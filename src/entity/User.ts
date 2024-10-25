import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { UserData } from '../types';

@Entity()
export class User implements UserData {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   firstName: string;

   @Column()
   lastName: string;

   @Column()
   password: string;

   @Column()
   email: string;
}
