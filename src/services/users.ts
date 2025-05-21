import {
  RedmineUser,
  RedmineResponse,
  RedmineSingleResponse
} from '../types/redmine';
import { getRedmineClient } from './redmine-client';

export class UsersService {
  async listUsers(params: any = {}): Promise<RedmineResponse<RedmineUser>> {
    const client = getRedmineClient();
    const response = await client.get<{ users: RedmineUser[] } & { total_count: number; offset: number; limit: number }>(
      'users.json',
      params
    );
    
    return {
      items: response.users,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getUser(id: number): Promise<RedmineSingleResponse<RedmineUser>> {
    const client = getRedmineClient();
    const response = await client.get<{ user: RedmineUser }>(`users/${id}.json`);
    return { item: response.user };
  }

  async getCurrentUser(): Promise<RedmineSingleResponse<RedmineUser>> {
    const client = getRedmineClient();
    const response = await client.get<{ user: RedmineUser }>('users/current.json');
    return { item: response.user };
  }

  async createUser(params: any): Promise<RedmineSingleResponse<RedmineUser>> {
    const client = getRedmineClient();
    const response = await client.post<{ user: RedmineUser }>('users.json', {
      user: params,
    });
    return { item: response.user };
  }

  async updateUser(id: number, params: any): Promise<RedmineSingleResponse<RedmineUser>> {
    const client = getRedmineClient();
    const response = await client.put<{ user: RedmineUser }>(`users/${id}.json`, {
      user: params,
    });
    return { item: response.user };
  }

  async deleteUser(id: number): Promise<void> {
    const client = getRedmineClient();
    await client.delete(`users/${id}.json`);
  }

  // Additional user-related methods
  async getUserMemberships(id: number): Promise<RedmineResponse<any>> {
    const client = getRedmineClient();
    const response = await client.get<{ memberships: any[] } & { total_count: number; offset: number; limit: number }>(
      `users/${id}/memberships.json`
    );
    
    return {
      items: response.memberships,
      total_count: response.total_count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getUserGroups(id: number): Promise<RedmineResponse<any>> {
    const client = getRedmineClient();
    const response = await client.get<{ groups: any[] }>(
      `users/${id}.json?include=groups`
    );
    
    return {
      items: response.groups || [],
      total_count: response.groups?.length || 0,
      offset: 0,
      limit: 100,
    };
  }
}

// Export a singleton instance
export const usersService = new UsersService();
