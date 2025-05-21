import {
  ErrorCode,
  McpError,
  ToolCallContent,
  ToolCallResult,
} from '@modelcontextprotocol/sdk';
import { issuesService } from '../services/issues';
import { IssueCreateParams, IssueQueryParams, IssueUpdateParams } from '../types/redmine';

export const issueTools = {
  list_issues: {
    name: 'list_issues',
    description: 'List Redmine issues with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'number', description: 'Filter by project ID' },
        status_id: { type: 'string', description: 'Filter by status ID. Use "*" for any status' },
        assigned_to_id: { type: 'number', description: 'Filter by assigned user ID' },
        offset: { type: 'number', description: 'Number of issues to skip' },
        limit: { type: 'number', description: 'Maximum number of issues to return' },
      },
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params: IssueQueryParams = content.arguments;
        const result = await issuesService.listIssues(params);
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

  get_issue: {
    name: 'get_issue',
    description: 'Get details of a specific Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Issue ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        const result = await issuesService.getIssue(id);
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

  create_issue: {
    name: 'create_issue',
    description: 'Create a new Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'number', description: 'Project ID' },
        subject: { type: 'string', description: 'Issue subject' },
        description: { type: 'string', description: 'Issue description' },
        priority_id: { type: 'number', description: 'Priority ID' },
        tracker_id: { type: 'number', description: 'Tracker ID' },
        status_id: { type: 'number', description: 'Status ID' },
        assigned_to_id: { type: 'number', description: 'Assigned user ID' },
        parent_issue_id: { type: 'number', description: 'Parent issue ID' },
        estimated_hours: { type: 'number', description: 'Estimated hours' },
        done_ratio: { type: 'number', description: 'Done ratio (0-100)' },
      },
      required: ['project_id', 'subject'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params = content.arguments as IssueCreateParams;
        const result = await issuesService.createIssue(params);
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

  update_issue: {
    name: 'update_issue',
    description: 'Update an existing Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Issue ID' },
        notes: { type: 'string', description: 'Notes to add to the issue' },
        subject: { type: 'string', description: 'Issue subject' },
        description: { type: 'string', description: 'Issue description' },
        priority_id: { type: 'number', description: 'Priority ID' },
        status_id: { type: 'number', description: 'Status ID' },
        assigned_to_id: { type: 'number', description: 'Assigned user ID' },
        estimated_hours: { type: 'number', description: 'Estimated hours' },
        done_ratio: { type: 'number', description: 'Done ratio (0-100)' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id, ...params } = content.arguments as { id: number } & IssueUpdateParams;
        const result = await issuesService.updateIssue(id, params);
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

  delete_issue: {
    name: 'delete_issue',
    description: 'Delete a Redmine issue',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Issue ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        await issuesService.deleteIssue(id);
        return {
          content: [
            {
              type: 'text',
              text: `Issue ${id} has been deleted`,
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },
};
