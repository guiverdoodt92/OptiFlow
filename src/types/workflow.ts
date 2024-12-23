import { User } from './user';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowFormData {
  name: string;
  description: string;
  status: Workflow['status'];
}