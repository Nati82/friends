import { UUIDVersion } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Friend } from '../../user/entities/Friend.Entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column()
  message: string;

  @Column()
  file: string;

  @ManyToOne(() => Friend, (friend) => friend.id, { eager: true })
  friend: UUIDVersion;
}
