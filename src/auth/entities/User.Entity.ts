import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  bio: string;

  @Column()
  profile: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted a user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated a user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed a user with id', this.id);
  }
}
