import { Model } from 'sutando';

export default class Achievement extends Model {
  id!: number;
  achievement!: string;
  point!: number;
  created_at!: Date;
  updated_at!: Date;
}