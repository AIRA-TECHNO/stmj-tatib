import { Model } from 'sutando';

export default class StudentViolation extends Model {
  id!: number;

  student_x_user_id!: number;
  author_x_user_id!: number;
  rule_school_id!: number;
  rule!: string;
  point!: number;
  note!: string;
  date!: number;

  created_at!: Date;
  updated_at!: Date;
}