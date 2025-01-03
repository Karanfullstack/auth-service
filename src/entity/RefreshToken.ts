import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';

import { User } from './User';

@Entity({ name: 'refreshTokens' })
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @UpdateDateColumn()
    updateAt: number;

    @CreateDateColumn()
    createdAt: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;
}
