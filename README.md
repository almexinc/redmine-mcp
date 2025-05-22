# Redmine MCP Server

MCP server for interacting with Redmine's REST API. Provides tools for managing issues, projects, users, and time entries.

## Quick Start

1. In VSCode:
   Make sure you have Node.js version 16 or higher installed, then run:
   ```bash
   npx -y @almexinc/redmine-mcp-server
   ```

2. Configure VSCode:
   Edit `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`:

   ```json
   {
     "mcpServers": {
       "redmine-server": {
         "command": "npx",
         "args": ["-y", "@almexinc/redmine-mcp-server"],
         "env": {
           "REDMINE_API_KEY": "your-api-key",
           "REDMINE_URL": "https://redmine.almex-contents.jp/"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

## Available Tools

### Issues
- `list_issues`: List issues with filtering (project_id, status_id, etc.)
- `get_issue`: Get issue details by ID
- `create_issue`: Create new issue
- `update_issue`: Update existing issue
- `delete_issue`: Delete issue

### Projects
- `list_projects`: List all projects
- `get_project`: Get project details
- `create_project`: Create new project
- `update_project`: Update project
- `delete_project`: Delete project

### Users
- `list_users`: List users
- `get_user`: Get user details
- `get_current_user`: Get current user info

### Time Entries
- `list_time_entries`: List time entries
- `get_time_entry`: Get time entry details
- `create_time_entry`: Log time
- `update_time_entry`: Update time entry
- `delete_time_entry`: Delete time entry

## Example Usage

```typescript
// List issues in a project
list_issues with project_id=1 and limit=5

// Create an issue
create_issue with project_id=1, subject="Bug fix needed", description="Fix login error"

// Log time
create_time_entry with issue_id=123, hours=2.5, activity_id=9, comments="Code review"
```

## Configuration Options

- Environment variables:
  - `REDMINE_URL`: Instance URL (default: https://redmine.almex-contents.jp/)
  - `REDMINE_API_KEY`: Your API key

- Command line:
  ```bash
  redmine-mcp-server --url https://redmine.almex-contents.jp/ --api-key your-api-key
  ```

## License

MIT
