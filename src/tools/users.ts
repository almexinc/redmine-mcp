import {
  ErrorCode,
  McpError,
  ToolCallContent,
  ToolCallResult,
} from '@modelcontextprotocol/sdk';
import { usersService } from '../services/users';

export const userTools = {
  list_users: {
    name: 'list_users',
    description: 'List all Redmine users with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Number of users to skip' },
        limit: { type: 'number', description: 'Maximum number of users to return' },
        status: { type: 'number', description: 'Filter by status (1=active, 2=registered, 3=locked)' },
      },
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params = content.arguments;
        const result = await usersService.listUsers(params);
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

  get_user: {
    name: 'get_user',
    description: 'Get details of a specific Redmine user',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        const result = await usersService.getUser(id);
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

  get_current_user: {
    name: 'get_current_user',
    description: 'Get details of the current user based on the API key',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const result = await usersService.getCurrentUser();
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

  create_user: {
    name: 'create_user',
    description: 'Create a new Redmine user',
    inputSchema: {
      type: 'object',
      properties: {
        login: { type: 'string', description: 'User login' },
        firstname: { type: 'string', description: 'User first name' },
        lastname: { type: 'string', description: 'User last name' },
        mail: { type: 'string', description: 'User email' },
        password: { type: 'string', description: 'User password' },
        auth_source_id: { type: 'number', description: 'Authentication source ID' },
        mail_notification: { type: 'string', description: 'Mail notification preference' },
        must_change_passwd: { type: 'boolean', description: 'Whether user must change password on next login' },
      },
      required: ['login', 'firstname', 'lastname', 'mail'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params = content.arguments;
        const result = await usersService.createUser(params);
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

  update_user: {
    name: 'update_user',
    description: 'Update an existing Redmine user',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
        login: { type: 'string', description: 'User login' },
        firstname: { type: 'string', description: 'User first name' },
        lastname: { type: 'string', description: 'User last name' },
        mail: { type: 'string', description: 'User email' },
        password: { type: 'string', description: 'User password' },
        auth_source_id: { type: 'number', description: 'Authentication source ID' },
        mail_notification: { type: 'string', description: 'Mail notification preference' },
        must_change_passwd: { type: 'boolean', description: 'Whether user must change password on next login' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id, ...params } = content.arguments as { id: number } & Record<string, any>;
        const result = await usersService.updateUser(id, params);
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

  delete_user: {
    name: 'delete_user',
    description: 'Delete a Redmine user',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        await usersService.deleteUser(id);
        return {
          content: [
            {
              type: 'text',
              text: `User ${id} has been deleted`,
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  get_user_memberships: {
    name: 'get_user_memberships',
    description: 'Get all project memberships for a user',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        const result = await usersService.getUserMemberships(id);
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

  get_user_groups: {
    name: 'get_user_groups',
    description: 'Get all groups a user belongs to',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'User ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: number };
        const result = await usersService.getUserGroups(id);
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
