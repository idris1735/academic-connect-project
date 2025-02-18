import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Async actions
export const fetchWorkflows = createAsyncThunk(
  'workflow/fetchWorkflows',
  async () => {
    const response = await fetch('/api/workflows/get_workflows');
    if (!response.ok) {
      throw new Error('Failed to fetch workflows');
    }
    const data = await response.json();
   
    return data.workflows;
  }
);

export const createWorkflow = createAsyncThunk(
  'workflow/createWorkflow',
  async ({ name }) => {
    const response = await fetch('/api/workflows/create_workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Failed to create workflow');
    }
    const data = await response.json();
    return data.workflow;
  }
);

export const addTask = createAsyncThunk(
  'workflow/addTask',
  async ({ workflowId, title, description, assignedTo, dueDate }) => {
    const response = await fetch(`/api/workflows/${workflowId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, assignedTo, dueDate }),
    });
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    const data = await response.json();
    return { workflowId, task: data.task };
  }
);

export const updateTaskStatus = createAsyncThunk(
  'workflow/updateTaskStatus',
  async ({ workflowId, taskId, status }) => {
    const response = await fetch(`/api/workflows/${workflowId}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    const data = await response.json();
    return { workflowId, taskId, task: data.task };
  }
);

export const addTaskComment = createAsyncThunk(
  'workflow/addTaskComment',
  async ({ workflowId, taskId, content }) => {
    const response = await fetch(`/api/workflows/${workflowId}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    const data = await response.json();
    return { workflowId, taskId, comment: data.comment };
  }
);

export const updateWorkflowFromWebsocket = createAction(
  'workflow/updateFromWebsocket',
  (updatedWorkflow) => ({
    payload: updatedWorkflow
  })
);

const workflowSlice = createSlice({
  name: 'workflow',
  initialState: {
    workflows: [],
    currentWorkflow: null,
    loading: false,
    error: null,
    lastUpdatedId: null
  },
  reducers: {
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    updateFromWebsocket: (state, action) => {
      const { workflow, changeType, type } = action.payload;
      
      // Don't skip task updates even if workflow ID matches
      if (state.lastUpdatedId === workflow.id && changeType !== 'task_updated') {
        console.log('Skipping non-task update for workflow:', workflow.id);
        return;
      }

      // Function to update workflow in both arrays and current
      const updateWorkflowAndTasks = (updatedWorkflow) => {
        const index = state.workflows.findIndex(w => w.id === updatedWorkflow.id);
        if (index !== -1) {
          // Ensure we preserve task status
          const updatedTasks = updatedWorkflow.tasks?.map(newTask => {
            const existingTask = state.workflows[index].tasks?.find(t => t.id === newTask.id);
            return {
              ...newTask,
              status: newTask.status || existingTask?.status || 'To do'
            };
          });
          
          state.workflows[index] = {
            ...updatedWorkflow,
            tasks: updatedTasks || []
          };
        }

        if (state.currentWorkflow?.id === updatedWorkflow.id) {
          // Apply the same task status preservation for currentWorkflow
          const updatedTasks = updatedWorkflow.tasks?.map(newTask => {
            const existingTask = state.currentWorkflow.tasks?.find(t => t.id === newTask.id);
            return {
              ...newTask,
              status: newTask.status || existingTask?.status || 'To do'
            };
          });

          state.currentWorkflow = {
            ...updatedWorkflow,
            tasks: updatedTasks || []
          };
        }
      };

      switch (changeType) {
        case 'added':
          if (!state.workflows.some(w => w.id === workflow.id)) {
            console.log('Adding new workflow:', workflow);
            state.workflows.push(workflow);
          }
          break;

        case 'modified':
          updateWorkflowAndTasks(workflow);
          break;

        case 'task_added':
          updateWorkflowAndTasks(workflow);
          break;

        case 'task_updated':
          updateWorkflowAndTasks(workflow);
          // Don't update lastUpdatedId for task updates
          return;

        default:
           return;
      }

      // Only update lastUpdatedId for non-task updates
      state.lastUpdatedId = workflow.id;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch workflows
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
          state.workflows = action.payload;
          console.log('workflows actions', state.workflows);
        state.loading = false;
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle create workflow
      .addCase(createWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        // Check if workflow already exists
        if (!state.workflows.some(w => w.id === action.payload.id)) {
          state.workflows.push(action.payload);
          state.currentWorkflow = action.payload;
          state.lastUpdatedId = action.payload.id; // Set the last updated ID
        }
        state.loading = false;
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle add task
      .addCase(addTask.fulfilled, (state, action) => {
        state.lastUpdatedId = action.payload.workflowId; // Set lastUpdatedId for task addition
        
        const workflow = state.workflows.find(w => w.id === action.payload.workflowId);
        if (workflow) {
          workflow.tasks = workflow.tasks || [];
          // Check if task already exists
          if (!workflow.tasks.some(t => t.id === action.payload.task.id)) {
            workflow.tasks.push(action.payload.task);
          }
        }
        
        if (state.currentWorkflow?.id === action.payload.workflowId) {
          state.currentWorkflow.tasks = state.currentWorkflow.tasks || [];
          // Check if task already exists in currentWorkflow
          if (!state.currentWorkflow.tasks.some(t => t.id === action.payload.task.id)) {
            state.currentWorkflow.tasks.push(action.payload.task);
          }
        }
      })
      // Handle update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.lastUpdatedId = action.payload.workflowId; // Set lastUpdatedId for status update
        
        const workflow = state.workflows.find(w => w.id === action.payload.workflowId);
        if (workflow) {
          const taskIndex = workflow.tasks.findIndex(t => t.id === action.payload.taskId);
          if (taskIndex !== -1) {
            // Update task immediately
            workflow.tasks[taskIndex] = {
              ...workflow.tasks[taskIndex],
              ...action.payload.task,
              lastUpdate: new Date().toISOString() // Add immediate timestamp
            };
          }
        }

        if (state.currentWorkflow?.id === action.payload.workflowId) {
          const taskIndex = state.currentWorkflow.tasks.findIndex(t => t.id === action.payload.taskId);
          if (taskIndex !== -1) {
            // Update currentWorkflow task immediately
            state.currentWorkflow.tasks[taskIndex] = {
              ...state.currentWorkflow.tasks[taskIndex],
              ...action.payload.task,
              lastUpdate: new Date().toISOString() // Add immediate timestamp
            };
          }
        }
      })
      // Handle add task comment
      .addCase(addTaskComment.fulfilled, (state, action) => {
        const workflow = state.workflows.find(w => w.id === action.payload.workflowId);
        if (workflow) {
          const task = workflow.tasks.find(t => t.id === action.payload.taskId);
          if (task) {
            task.comments = task.comments || [];
            task.comments.push(action.payload.comment);
          }
        }
        if (state.currentWorkflow?.id === action.payload.workflowId) {
          const task = state.currentWorkflow.tasks.find(t => t.id === action.payload.taskId);
          if (task) {
            task.comments = task.comments || [];
            task.comments.push(action.payload.comment);
          }
        }
      });
  }
});

export const { setCurrentWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer; 



// How do I use the workflowSlice reducers? I tried to use it but it wasn't workign as it should. Inly show the solution for fetching workflow first. If it works, we can proceed to use it for every order part of the workflow.