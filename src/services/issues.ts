import {
  RedmineIssue,
  RedmineResponse,
  RedmineSingleResponse,
  IssueCreateParams,
  IssueUpdateParams,
  IssueQueryParams,
} from '../types/redmine';
import { getRedmineClient } from './redmine-client';

export class IssuesService {
  async listIssues(params: IssueQueryParams = {}): Promise<RedmineResponse<RedmineIssue>> {
    const client = getRedmineClient();
    const response = await client.get<{ issues: RedmineIssue[] } & { total_count: number; offset: number; limit: number }>(
      'issues.json',
      params
    );
    
    return {
      items: response.issues,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getIssue(id: number): Promise<RedmineSingleResponse<RedmineIssue>> {
    const client = getRedmineClient();
    const response = await client.get<{ issue: RedmineIssue }>(`issues/${id}.json`);
    return { item: response.issue };
  }

  async createIssue(params: IssueCreateParams): Promise<RedmineSingleResponse<RedmineIssue>> {
    const client = getRedmineClient();
    const response = await client.post<{ issue: RedmineIssue }>('issues.json', {
      issue: params,
    });
    return { item: response.issue };
  }

  async updateIssue(id: number, params: IssueUpdateParams): Promise<RedmineSingleResponse<RedmineIssue>> {
    const client = getRedmineClient();
    const response = await client.put<{ issue: RedmineIssue }>(`issues/${id}.json`, {
      issue: params,
    });
    return { item: response.issue };
  }

  async deleteIssue(id: number): Promise<void> {
    const client = getRedmineClient();
    await client.delete(`issues/${id}.json`);
  }

  // Helper methods for specific operations
  async assignIssue(id: number, userId: number): Promise<RedmineSingleResponse<RedmineIssue>> {
    return this.updateIssue(id, { assigned_to_id: userId });
  }

  async updateStatus(id: number, statusId: number, notes?: string): Promise<RedmineSingleResponse<RedmineIssue>> {
    return this.updateIssue(id, { status_id: statusId, notes });
  }

  async updatePriority(id: number, priorityId: number): Promise<RedmineSingleResponse<RedmineIssue>> {
    return this.updateIssue(id, { priority_id: priorityId });
  }

  async addComment(id: number, comment: string): Promise<RedmineSingleResponse<RedmineIssue>> {
    return this.updateIssue(id, { notes: comment });
  }

  async updateEstimatedHours(id: number, hours: number): Promise<RedmineSingleResponse<RedmineIssue>> {
    return this.updateIssue(id, { estimated_hours: hours });
  }

  async updateDoneRatio(id: number, doneRatio: number): Promise<RedmineSingleResponse<RedmineIssue>> {
    if (doneRatio < 0 || doneRatio > 100) {
      throw new Error('Done ratio must be between 0 and 100');
    }
    return this.updateIssue(id, { done_ratio: doneRatio });
  }
}

// Export a singleton instance
export const issuesService = new IssuesService();
