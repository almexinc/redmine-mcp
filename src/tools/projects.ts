import {
  ErrorCode,
  McpError,
  ToolCallContent,
  ToolCallResult,
} from '@modelcontextprotocol/sdk';
import { projectsService } from '../services/projects';
import { ProjectCreateParams, ProjectUpdateParams, ProjectQueryParams } from '../types/redmine';

export const projectTools = {
  list_projects: {
    name: 'list_projects',
    description: 'List all Redmine projects with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        offset: { type: 'number', description: 'Number of projects to skip' },
        limit: { type: 'number', description: 'Maximum number of projects to return' },
      },
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params: ProjectQueryParams = content.arguments;
        const result = await projectsService.listProjects(params);
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

  get_project: {
    name: 'get_project',
    description: 'Get details of a specific Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          oneOf: [
            { type: 'number', description: 'Project ID' },
            { type: 'string', description: 'Project identifier' },
          ],
          description: 'Project ID or identifier',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: string | number };
        const result = await projectsService.getProject(id);
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

  create_project: {
    name: 'create_project',
    description: 'Create a new Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        identifier: { type: 'string', description: 'Project identifier (used in URL)' },
        description: { type: 'string', description: 'Project description' },
        homepage: { type: 'string', description: 'Project homepage URL' },
        is_public: { type: 'boolean', description: 'Whether the project is public' },
        inherit_members: { type: 'boolean', description: 'Whether to inherit members from parent project' },
        parent_id: { type: 'number', description: 'Parent project ID' },
      },
      required: ['name', 'identifier'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const params = content.arguments as ProjectCreateParams;
        const result = await projectsService.createProject(params);
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

  update_project: {
    name: 'update_project',
    description: 'Update an existing Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          oneOf: [
            { type: 'number', description: 'Project ID' },
            { type: 'string', description: 'Project identifier' },
          ],
          description: 'Project ID or identifier',
        },
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
        homepage: { type: 'string', description: 'Project homepage URL' },
        is_public: { type: 'boolean', description: 'Whether the project is public' },
        inherit_members: { type: 'boolean', description: 'Whether to inherit members from parent project' },
        parent_id: { type: 'number', description: 'Parent project ID' },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id, ...params } = content.arguments as { id: string | number } & ProjectUpdateParams;
        const result = await projectsService.updateProject(id, params);
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

  delete_project: {
    name: 'delete_project',
    description: 'Delete a Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          oneOf: [
            { type: 'number', description: 'Project ID' },
            { type: 'string', description: 'Project identifier' },
          ],
          description: 'Project ID or identifier',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: string | number };
        await projectsService.deleteProject(id);
        return {
          content: [
            {
              type: 'text',
              text: `Project ${id} has been deleted`,
            },
          ],
        };
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, (error as Error).message);
      }
    },
  },

  get_project_members: {
    name: 'get_project_members',
    description: 'Get the members of a Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          oneOf: [
            { type: 'number', description: 'Project ID' },
            { type: 'string', description: 'Project identifier' },
          ],
          description: 'Project ID or identifier',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: string | number };
        const result = await projectsService.getProjectMembers(id);
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

  get_project_versions: {
    name: 'get_project_versions',
    description: 'Get the versions of a Redmine project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          oneOf: [
            { type: 'number', description: 'Project ID' },
            { type: 'string', description: 'Project identifier' },
          ],
          description: 'Project ID or identifier',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
    async execute(content: ToolCallContent): Promise<ToolCallResult> {
      try {
        const { id } = content.arguments as { id: string | number };
        const result = await projectsService.getProjectVersions(id);
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
