import { User } from 'src/auth/User.Entity';
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
  } from 'typeorm';
  
  @Entity('messages')
  export class FriendRequest {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ManyToOne(() => User, user => user.id)
    sentTo: string

    @ManyToOne(() => User, user => user.id)
    sentFrom: string;

    @Column()
    message: string;

    @Column()
    attachment: string;
  
    @AfterInsert()
    logInsert() {
      console.log('Inserted a message  with id', this.id);
    }
  
    @AfterUpdate()
    logUpdate() {
      console.log('Updated a message with id', this.id);
    }
  
    @AfterRemove()
    logRemove() {
      console.log('Removed a message with id', this.id);
    }
  }
  