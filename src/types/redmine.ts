export interface RedmineIssue {
  id: number;
  project: { id: number; name: string };
  tracker: { id: number; name: string };
  status: { id: number; name: string };
  priority: { id: number; name: string };
  author: { id: number; name: string };
  assigned_to?: { id: number; name: string };
  subject: string;
  description: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  estimated_hours?: number;
  spent_hours?: number;
  created_on: string;
  updated_on: string;
  closed_on?: string;
}

export interface RedmineProject {
  id: number;
  name: string;
  identifier: string;
  description: string;
  status: number;
  created_on: string;
  updated_on: string;
}

export interface RedmineUser {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  last_login_on?: string;
  status: number;
}

export interface RedmineTimeEntry {
  id: number;
  project: { id: number; name: string };
  issue?: { id: number };
  user: { id: number; name: string };
  activity: { id: number; name: string };
  hours: number;
  comments: string;
  spent_on: string;
  created_on: string;
  updated_on: string;
}

export interface RedmineResponse<T> {
  total_count: number;
  offset: number;
  limit: number;
  items: T[];
}

export interface RedmineSingleResponse<T> {
  item: T;
}

export interface RedmineError {
  errors: string[];
}

// API request interfaces
export interface IssueCreateParams {
  project_id: number;
  subject: string;
  description?: string;
  priority_id?: number;
  tracker_id?: number;
  status_id?: number;
  assigned_to_id?: number;
  parent_issue_id?: number;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  done_ratio?: number;
}

export interface IssueUpdateParams extends Partial<IssueCreateParams> {
  notes?: string;
}

export interface ProjectCreateParams {
  name: string;
  identifier: string;
  description?: string;
  homepage?: string;
  inherit_members?: boolean;
  is_public?: boolean;
  parent_id?: number;
}

export interface ProjectUpdateParams extends Partial<ProjectCreateParams> {}

export interface TimeEntryCreateParams {
  issue_id?: number;
  project_id?: number;
  spent_on: string;
  hours: number;
  activity_id: number;
  comments?: string;
}

export interface TimeEntryUpdateParams extends Partial<TimeEntryCreateParams> {}

// Query parameters interfaces
export interface IssueQueryParams {
  project_id?: number;
  tracker_id?: number;
  status_id?: string; // can be '*' for any status
  assigned_to_id?: number;
  parent_id?: number;
  start_date?: string;
  due_date?: string;
  updated_on?: string;
  created_on?: string;
  offset?: number;
  limit?: number;
}

export interface ProjectQueryParams {
  offset?: number;
  limit?: number;
}

export interface TimeEntryQueryParams {
  user_id?: number;
  project_id?: number;
  issue_id?: number;
  activity_id?: number;
  from?: string;
  to?: string;
  offset?: number;
  limit?: number;
}
