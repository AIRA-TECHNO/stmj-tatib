import { Model } from 'sutando';

export default class User extends Model {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  created_at!: Date;
  updated_at!: Date;
}