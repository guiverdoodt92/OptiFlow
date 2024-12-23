import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWorkflows } from '../../hooks/useWorkflows';
import { WorkflowList } from '../../components/workflows/WorkflowList';
import { Workflow } from '../../types/workflow';

export function WorkflowsPage() {
  const { workflows, loading, error } = useWorkflows();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading workflows...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          New Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new workflow.
          </p>
        </div>
      ) : (
        <WorkflowList
          workflows={workflows}
          onSelect={setSelectedWorkflow}
        />
      )}
    </div>
  );
}