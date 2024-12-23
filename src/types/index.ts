export interface User {
  id: string;
  email: string;
  role: 'admin' | 'team_member';
  created_at: string;
}

export interface CompanyData {
  id: string;
  name: string;
  industry: string;
  size: string;
  country: string;
  user_id: string;
  created_at: string;
}

export interface WorkflowData {
  id: string;
  company_id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}