# Redmine MCP Server

A [Model Context Protocol](https://modelcontextprotocol.ai/) server for interacting with Redmine's REST API. This server provides MCP tools to work with Redmine issues, projects, users, and more.

## Installation

```bash
npm install redmine-mcp-server
```

## Usage

### As a standalone server

You can run the Redmine MCP server directly:

```bash
# Using environment variables
REDMINE_URL=https://your-redmine-instance.com/ REDMINE_API_KEY=your-api-key redmine-mcp-server

# Or with command line arguments
redmine-mcp-server --url https://your-redmine-instance.com/ --api-key your-api-key
```

### In VSCode with the Claude Extension

1. Install the Redmine MCP server:
   ```bash
   npm install -g redmine-mcp-server
   ```

2. Configure the Claude extension settings file at:  
   `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

   Add the following configuration:

   ```json
   {
     "mcpServers": {
       "redmine-server": {
         "command": "redmine-mcp-server",
         "args": [],
         "env": {
           "REDMINE_API_KEY": "your-api-key",
           "REDMINE_URL": "https://your-redmine-instance.com/"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

   Replace `your-api-key` with your Redmine API key and `https://your-redmine-instance.com/` with your Redmine instance URL.

## Configuration

The Redmine MCP server can be configured using:

- Environment variables
- Command line arguments
- Configuration file

### Environment Variables

- `REDMINE_URL`: URL of the Redmine instance (default: `https://redmine.almex-contents.jp/`)
- `REDMINE_API_KEY`: Your Redmine API key

### Command Line Arguments

- `--url`: URL of the Redmine instance
- `--api-key`: Your Redmine API key
- `--config`: Path to configuration file

### Configuration File

Create a `.redminemcprc.json` file with the following structure:

```json
{
  "url": "https://your-redmine-instance.com/",
  "apiKey": "your-api-key"
}
```

## Available Tools

### Issues

- `list_issues`: List Redmine issues with optional filtering
- `get_issue`: Get details of a specific issue
- `create_issue`: Create a new issue
- `update_issue`: Update an existing issue
- `delete_issue`: Delete an issue

### Projects

- `list_projects`: List all projects
- `get_project`: Get details of a specific project
- `create_project`: Create a new project
- `update_project`: Update an existing project
- `delete_project`: Delete a project

### Users

- `list_users`: List all users
- `get_user`: Get details of a specific user
- `get_current_user`: Get details of the current user

### Time Entries

- `list_time_entries`: List all time entries
- `get_time_entry`: Get details of a specific time entry
- `create_time_entry`: Create a new time entry
- `update_time_entry`: Update an existing time entry
- `delete_time_entry`: Delete a time entry

## Examples

### Working with Issues

```
# List issues in project "example"
list_issues with project_id=1 and limit=5

# Create a new issue
create_issue with project_id=1, subject="Test issue", description="This is a test issue"

# Update an issue
update_issue with id=123, status_id=2, notes="Changed status to in progress"

# Delete an issue
delete_issue with id=123
```

### Working with Projects

```
# List all projects
list_projects

# Get a specific project
get_project with id=1

# Create a new project
create_project with name="Test Project", identifier="test-project", description="This is a test project"
```

## License

MIT
