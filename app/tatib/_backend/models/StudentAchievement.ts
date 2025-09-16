import { Model } from 'sutando';

export default class StudentAchievement extends Model {
  connection = 'tatib';

  id!: number;
  student_x_user_id!: number;
  author_x_user_id!: number;
  achievement_id!: number;
  achievement!: string;
  point!: number;
  note!: string;
  date!: number;
  created_at!: Date;
  updated_at!: Date;
}