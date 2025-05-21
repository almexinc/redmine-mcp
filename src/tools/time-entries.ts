import {
  ErrorCode,
  McpError,
  ToolCallContent,
  ToolCallResult,
} from '@modelcontextprotocol/sdk';
import { timeEntriesService } from '../services/time-entries';
import { TimeEntryCreateParams, TimeEntryUpdateParams, TimeEntryQueryParams } from '../types/redmine';

export const timeEntryTools = {
  list_time_entries: {
    name: 'list_time_entries',
    description: 'List all Redmine time entries with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'Filter by user ID' },
        project_id: { type: 'number', description: 'Filter by project ID' },
        issue_id: { type: 'number', description: 'Filter by issue ID' },
        activity_id: { type: 'number', description: 'Filter by activity ID' },
        from: { type: 'string', description: 'Filter by start date (YYYY-MM-DD)' },
        to: { type: 'string', description: 'Filter by end date (YYYY-MM-DD)' },
        offset: { type: 'number', description: 'Number of time entries to skip' },
        limit: { type: 'number', description: 'Maximum number of time entries to return' },
      },
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params: TimeEntryQueryParams = content.arguments;
        const result = await timeEntriesService.listTimeEntries(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  get_time_entry: {
    name: 'get_time_entry',
    description: 'Get details of a specific Redmine time entry',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Time entry ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        const result = await timeEntriesService.getTimeEntry(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  create_time_entry: {
    name: 'create_time_entry',
    description: 'Create a new Redmine time entry',
    inputSchema: {
      type: 'object',
      properties: {
        issue_id: { type: 'number', description: 'Issue ID (either issue_id or project_id is required)' },
        project_id: { type: 'number', description: 'Project ID (either issue_id or project_id is required)' },
        spent_on: { type: 'string', description: 'Date (YYYY-MM-DD)' },
        hours: { type: 'number', description: 'Hours spent' },
        activity_id: { type: 'number', description: 'Activity ID' },
        comments: { type: 'string', description: 'Comments' },
      },
      required: ['spent_on', 'hours', 'activity_id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params = content.arguments as TimeEntryCreateParams;
        
        // Validate that either issue_id or project_id is provided
        if (!params.issue_id && !params.project_id) {
          throw new Error('Either issue_id or project_id must be provided');
        }
        
        const result = await timeEntriesService.createTimeEntry(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  update_time_entry: {
    name: 'update_time_entry',
    description: 'Update an existing Redmine time entry',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Time entry ID' },
        issue_id: { type: 'number', description: 'Issue ID' },
        project_id: { type: 'number', description: 'Project ID' },
        spent_on: { type: 'string', description: 'Date (YYYY-MM-DD)' },
        hours: { type: 'number', description: 'Hours spent' },
        activity_id: { type: 'number', description: 'Activity ID' },
        comments: { type: 'string', description: 'Comments' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id, ...params } = content.arguments as { id: number } & TimeEntryUpdateParams;
        const result = await timeEntriesService.updateTimeEntry(id, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  delete_time_entry: {
    name: 'delete_time_entry',
    description: 'Delete a Redmine time entry',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Time entry ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        await timeEntriesService.deleteTimeEntry(id);
        return {
          content: [
            {
              type: 'text',
              text: `Time entry ${id} has been deleted`,
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  get_issue_time_entries: {
    name: 'get_issue_time_entries',
    description: 'Get all time entries for a specific issue',
    inputSchema: {
      type: 'object',
      properties: {
        issue_id: { type: 'number', description: 'Issue ID' },
        offset: { type: 'number', description: 'Number of time entries to skip' },
        limit: { type: 'number', description: 'Maximum number of time entries to return' },
      },
      required: ['issue_id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { issue_id, ...params } = content.arguments as { issue_id: number } & Omit<TimeEntryQueryParams, 'issue_id'>;
        const result = await timeEntriesService.getTimeEntriesForIssue(issue_id, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  get_project_time_entries: {
    name: 'get_project_time_entries',
    description: 'Get all time entries for a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'number', description: 'Project ID' },
        offset: { type: 'number', description: 'Number of time entries to skip' },
        limit: { type: 'number', description: 'Maximum number of time entries to return' },
        from: { type: 'string', description: 'Filter by start date (YYYY-MM-DD)' },
        to: { type: 'string', description: 'Filter by end date (YYYY-MM-DD)' },
      },
      required: ['project_id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { project_id, ...params } = content.arguments as { project_id: number } & Omit<TimeEntryQueryParams, 'project_id'>;
        const result = await timeEntriesService.getTimeEntriesForProject(project_id, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  get_user_time_entries: {
    name: 'get_user_time_entries',
    description: 'Get all time entries for a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'number', description: 'User ID' },
        offset: { type: 'number', description: 'Number of time entries to skip' },
        limit: { type: 'number', description: 'Maximum number of time entries to return' },
        from: { type: 'string', description: 'Filter by start date (YYYY-MM-DD)' },
        to: { type: 'string', description: 'Filter by end date (YYYY-MM-DD)' },
      },
      required: ['user_id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { user_id, ...params } = content.arguments as { user_id: number } & Omit<TimeEntryQueryParams, 'user_id'>;
        const result = await timeEntriesService.getTimeEntriesForUser(user_id, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },
};
