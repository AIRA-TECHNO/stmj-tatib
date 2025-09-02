import { Model } from 'sutando';

export default class ViewDataUser extends Model {
  id!: number;
  username!: string;
  password!: string;
  profile_type!: string;
  created_at!: number;
  updated_at!: number;
  name!: string;
  relation_id!: number;
  uuid!: string;
}