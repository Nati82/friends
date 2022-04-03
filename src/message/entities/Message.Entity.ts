import { UUIDVersion } from 'class-validator';
import { User } from 'src/auth/entities/User.Entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: UUIDVersion;

  @Column()
  message: string;

  @Column()
  file: string;

  @Column('date')
  date: Date;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  sentTo: UUIDVersion;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  sentBy: UUIDVersion;
}
