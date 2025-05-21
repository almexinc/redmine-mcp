import {
  RedmineProject,
  RedmineResponse,
  RedmineSingleResponse,
  ProjectCreateParams,
  ProjectUpdateParams,
  ProjectQueryParams,
} from '../types/redmine';
import { getRedmineClient } from './redmine-client';

export class ProjectsService {
  async listProjects(params: ProjectQueryParams = {}): Promise<RedmineResponse<RedmineProject>> {
    const client = getRedmineClient();
    const response = await client.get<{ projects: RedmineProject[] } & { total_count: number; offset: number; limit: number }>(
      'projects.json',
      params
    );
    
    return {
      items: response.projects,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getProject(idOrIdentifier: string | number): Promise<RedmineSingleResponse<RedmineProject>> {
    const client = getRedmineClient();
    const response = await client.get<{ project: RedmineProject }>(`projects/${idOrIdentifier}.json`);
    return { item: response.project };
  }

  async createProject(params: ProjectCreateParams): Promise<RedmineSingleResponse<RedmineProject>> {
    const client = getRedmineClient();
    const response = await client.post<{ project: RedmineProject }>('projects.json', {
      project: params,
    });
    return { item: response.project };
  }

  async updateProject(idOrIdentifier: string | number, params: ProjectUpdateParams): Promise<RedmineSingleResponse<RedmineProject>> {
    const client = getRedmineClient();
    const response = await client.put<{ project: RedmineProject }>(`projects/${idOrIdentifier}.json`, {
      project: params,
    });
    return { item: response.project };
  }

  async deleteProject(idOrIdentifier: string | number): Promise<void> {
    const client = getRedmineClient();
    await client.delete(`projects/${idOrIdentifier}.json`);
  }

  // Additional project-related methods
  async getProjectMembers(idOrIdentifier: string | number): Promise<RedmineResponse<any>> {
    const client = getRedmineClient();
    const response = await client.get<{ memberships: any[] } & { total_count: number; offset: number; limit: number }>(
      `projects/${idOrIdentifier}/memberships.json`
    );
    
    return {
      items: response.memberships,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getProjectIssues(idOrIdentifier: string | number, params: any = {}): Promise<RedmineResponse<any>> {
    const client = getRedmineClient();
    const queryParams = { ...params, project_id: idOrIdentifier };
    
    const response = await client.get<{ issues: any[] } & { total_count: number; offset: number; limit: number }>(
      'issues.json',
      queryParams
    );
    
    return {
      items: response.issues,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getProjectVersions(idOrIdentifier: string | number): Promise<RedmineResponse<any>> {
    const client = getRedmineClient();
    const response = await client.get<{ versions: any[] } & { total_count: number; offset: number; limit: number }>(
      `projects/${idOrIdentifier}/versions.json`
    );
    
    return {
      items: response.versions,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }
}

// Export a singleton instance
export const projectsService = new ProjectsService();
