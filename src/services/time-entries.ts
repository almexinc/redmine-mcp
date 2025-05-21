import {
  RedmineTimeEntry,
  RedmineResponse,
  RedmineSingleResponse,
  TimeEntryCreateParams,
  TimeEntryUpdateParams,
  TimeEntryQueryParams
} from '../types/redmine';
import { getRedmineClient } from './redmine-client';

export class TimeEntriesService {
  async listTimeEntries(params: TimeEntryQueryParams = {}): Promise<RedmineResponse<RedmineTimeEntry>> {
    const client = getRedmineClient();
    const response = await client.get<{ time_entries: RedmineTimeEntry[] } & { total_count: number; offset: number; limit: number }>(
      'time_entries.json',
      params
    );
    
    return {
      items: response.time_entries,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getTimeEntry(id: number): Promise<RedmineSingleResponse<RedmineTimeEntry>> {
    const client = getRedmineClient();
    const response = await client.get<{ time_entry: RedmineTimeEntry }>(`time_entries/${id}.json`);
    return { item: response.time_entry };
  }

  async createTimeEntry(params: TimeEntryCreateParams): Promise<RedmineSingleResponse<RedmineTimeEntry>> {
    const client = getRedmineClient();
    const response = await client.post<{ time_entry: RedmineTimeEntry }>('time_entries.json', {
      time_entry: params,
    });
    return { item: response.time_entry };
  }

  async updateTimeEntry(id: number, params: TimeEntryUpdateParams): Promise<RedmineSingleResponse<RedmineTimeEntry>> {
    const client = getRedmineClient();
    const response = await client.put<{ time_entry: RedmineTimeEntry }>(`time_entries/${id}.json`, {
      time_entry: params,
    });
    return { item: response.time_entry };
  }

  async deleteTimeEntry(id: number): Promise<void> {
    const client = getRedmineClient();
    await client.delete(`time_entries/${id}.json`);
  }

  // Helper methods
  async getTimeEntriesForIssue(issueId: number, params: TimeEntryQueryParams = {}): Promise<RedmineResponse<RedmineTimeEntry>> {
    const queryParams = {
      ...params,
      issue_id: issueId,
    };
    
    return this.listTimeEntries(queryParams);
  }

  async getTimeEntriesForProject(projectId: number, params: TimeEntryQueryParams = {}): Promise<RedmineResponse<RedmineTimeEntry>> {
    const queryParams = {
      ...params,
      project_id: projectId,
    };
    
    return this.listTimeEntries(queryParams);
  }

  async getTimeEntriesForUser(userId: number, params: TimeEntryQueryParams = {}): Promise<RedmineResponse<RedmineTimeEntry>> {
    const queryParams = {
      ...params,
      user_id: userId,
    };
    
    return this.listTimeEntries(queryParams);
  }
}

// Export a singleton instance
export const timeEntriesService = new TimeEntriesService();
