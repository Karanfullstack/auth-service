import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { UserData } from '../types';
import { Tenant } from './Tenant';

@Entity({ name: 'users' })
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

    @Column()
    role: string;

    @ManyToOne(() => Tenant)
    tenant: Tenant | undefined | null;

    @UpdateDateColumn()
    updateAt: number;

    @CreateDateColumn()
    createdAt: number;
}
