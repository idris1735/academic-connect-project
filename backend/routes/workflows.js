const express = require('express');
const router = express.Router();
const workflowService = require('../services/workflowService');

// Get user's workflows
router.get('/get_workflows', workflowService.getUserWorkflows);

// Create a new workflow
router.post('/create_workflow', workflowService.createWorkflow);

// Add a task to workflow
router.post('/:workflowId/tasks', workflowService.addTask);

// Update task status
router.patch('/:workflowId/tasks/:taskId/status', workflowService.updateTaskStatus);

// Add comment to task
router.post('/:workflowId/tasks/:taskId/comments', workflowService.addTaskComment);

// SSE endpoint for workflow updates
router.get('/events', workflowService.subscribeToWorkflowEvents);

module.exports = router;
