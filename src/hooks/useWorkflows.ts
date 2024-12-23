import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Workflow } from '../types/workflow';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  async function fetchWorkflows() {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  }

  async function createWorkflow(workflowData: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert([workflowData])
        .select()
        .single();

      if (error) throw error;
      setWorkflows([data, ...workflows]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create workflow');
    }
  }

  async function updateWorkflow(id: string, updates: Partial<Workflow>) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setWorkflows(workflows.map(w => w.id === id ? data : w));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update workflow');
    }
  }

  return {
    workflows,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    refreshWorkflows: fetchWorkflows,
  };
}