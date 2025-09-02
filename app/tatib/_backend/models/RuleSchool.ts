import { Model } from 'sutando';

export default class RuleSchool extends Model {
  id!: number;
  rule!: string;
  point!: number;
  created_at!: Date;
  updated_at!: Date;
}