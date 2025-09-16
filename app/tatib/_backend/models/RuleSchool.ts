import { Model } from 'sutando';

export default class RuleSchool extends Model {
  connection = 'tatib';

  id!: number;
  rule!: string;
  point!: number;
  punishment!: string;
  created_at!: Date;
  updated_at!: Date;
}