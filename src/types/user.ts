export interface User {
  id: string;
  email: string;
  role: 'admin' | 'team_member';
  full_name?: string;
  created_at: string;
  updated_at: string;
}