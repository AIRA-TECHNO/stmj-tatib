import { Model } from 'sutando';

export default class Achievement extends Model {
  connection = 'tatib';

  id!: number;
  achievement!: string;
  point!: number;
  created_at!: Date;
  updated_at!: Date;
}