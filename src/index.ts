#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk';
import { StdioServerTransport } from '@modelcontextprotocol/sdk';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk';
import { loadConfig } from './config';
import { issueTools } from './tools/issues';
import { projectTools } from './tools/projects';
import { userTools } from './tools/users';
import { timeEntryTools } from './tools/time-entries';

class RedmineServer {
  private server: Server;
  private allTools: Record<string, any>;

  constructor() {
    // Load all tools
    this.allTools = {
      // Issues tools
      list_issues: issueTools.list_issues,
      get_issue: issueTools.get_issue,
      create_issue: issueTools.create_issue,
      update_issue: issueTools.update_issue,
      delete_issue: issueTools.delete_issue,

      // Projects tools
      list_projects: projectTools.list_projects,
      get_project: projectTools.get_project,
      create_project: projectTools.create_project,
      update_project: projectTools.update_project,
      delete_project: projectTools.delete_project,
      get_project_members: projectTools.get_project_members,
      get_project_versions: projectTools.get_project_versions,

      // Users tools
      list_users: userTools.list_users,
      get_user: userTools.get_user,
      get_current_user: userTools.get_current_user,
      create_user: userTools.create_user,
      update_user: userTools.update_user,
      delete_user: userTools.delete_user,
      get_user_memberships: userTools.get_user_memberships,
      get_user_groups: userTools.get_user_groups,

      // Time entries tools
      list_time_entries: timeEntryTools.list_time_entries,
      get_time_entry: timeEntryTools.get_time_entry,
      create_time_entry: timeEntryTools.create_time_entry,
      update_time_entry: timeEntryTools.update_time_entry,
      delete_time_entry: timeEntryTools.delete_time_entry,
      get_issue_time_entries: timeEntryTools.get_issue_time_entries,
      get_project_time_entries: timeEntryTools.get_project_time_entries,
      get_user_time_entries: timeEntryTools.get_user_time_entries,
    };

    // Create server
    this.server = new Server(
      {
        name: 'redmine-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: this.allTools,
        },
      }
    );

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // List all tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Object.entries(this.allTools).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return { tools };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.server.capabilities.tools[request.params.name];
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool not found: ${request.params.name}`
        );
      }

      return tool.execute(request.params);
    });
  }

  async run() {
    // Load configuration
    const config = loadConfig();
    console.error(`Connecting to Redmine at: ${config.url}`);

    // Connect server
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Redmine MCP server running on stdio');
  }
}

// Create and run server
const server = new RedmineServer();
server.run().catch((error) => {
  console.error('Failed to start Redmine MCP server:', error);
  process.exit(1);
});
