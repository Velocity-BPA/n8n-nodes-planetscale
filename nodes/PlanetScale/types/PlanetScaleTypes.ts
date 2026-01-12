/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export type PlanetScaleResourceType =
  | 'organization'
  | 'database'
  | 'branch'
  | 'deployRequest'
  | 'password'
  | 'backup'
  | 'deployQueue'
  | 'serviceToken'
  | 'webhook'
  | 'organizationMember'
  | 'region'
  | 'user';

export interface IPlanetScaleCredentials {
  authType: 'serviceToken' | 'oauth';
  serviceTokenId?: string;
  serviceToken?: string;
  accessToken?: string;
}

export interface IPlanetScaleListResponse<T> {
  type: 'list';
  has_next: boolean;
  has_prev: boolean;
  cursor_start?: string;
  cursor_end?: string;
  data: T[];
}

export interface IOrganization {
  id: string;
  type: 'Organization';
  name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
  billing_email?: string;
  plan?: string;
  sso_enabled?: boolean;
  sso_directory?: string;
  free_databases_remaining?: number;
  can_create_databases?: boolean;
  valid_billing_info?: boolean;
  database_count?: number;
  sleeping_database_count?: number;
}

export interface IDatabase {
  id: string;
  type: 'Database';
  name: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  state: string;
  region?: {
    id: string;
    slug: string;
    display_name: string;
  };
  html_url?: string;
  branches_url?: string;
  branches_count?: number;
  production_branches_count?: number;
  development_branches_count?: number;
  default_branch?: string;
  default_branch_read_only_regions_count?: number;
  default_branch_shard_count?: number;
  default_branch_table_count?: number;
  data_import?: {
    state: string;
    import_check_errors?: string;
  };
  insights_raw_queries?: boolean;
  multiple_admins_required_for_deletion?: boolean;
  production_branch_web_console?: boolean;
  require_approval_for_deploy?: boolean;
  restrict_branch_region?: boolean;
  automatic_migrations?: boolean;
  migration_framework?: string;
  migration_table_name?: string;
  allow_data_branching?: boolean;
}

export interface IBranch {
  id: string;
  type: 'Branch';
  name: string;
  created_at: string;
  updated_at: string;
  access_host_url?: string;
  mysql_edge_address?: string;
  mysql_address?: string;
  parent_branch?: string;
  production?: boolean;
  ready?: boolean;
  safe_migrations?: boolean;
  shard_count?: number;
  sharded?: boolean;
  html_url?: string;
  schema_last_updated_at?: string;
  initial_restore_id?: string;
  restore_checklist_completed_at?: string;
}

export interface IDeployRequest {
  id: string;
  type: 'DeployRequest';
  number: number;
  branch: string;
  into_branch: string;
  notes?: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  deployed_at?: string;
  deployment_state?: string;
  html_url?: string;
  auto_cutover?: boolean;
  auto_delete_branch?: boolean;
  approved?: boolean;
}

export interface IPassword {
  id: string;
  type: 'Password';
  name?: string;
  created_at: string;
  username?: string;
  access_host_url?: string;
  role: string;
  database_branch?: {
    name: string;
    production: boolean;
  };
  renewable?: boolean;
  expires_at?: string;
  ttl?: number;
  replica?: boolean;
  connection_strings?: {
    [key: string]: string;
  };
  plain_text?: string;
}

export interface IBackup {
  id: string;
  type: 'Backup';
  name?: string;
  created_at: string;
  updated_at: string;
  state: string;
  size?: number;
  started_at?: string;
  completed_at?: string;
  expires_at?: string;
  estimated_storage_cost?: number;
  backup_policy?: {
    id: string;
    name: string;
    retention_unit: string;
    retention_value: number;
  };
}

export interface IDeployQueue {
  id: string;
  type: 'DeployQueue';
  pending_deploy_request?: IDeployRequest;
  in_progress_deploy_request?: IDeployRequest;
  queue: IDeployRequest[];
}

export interface IServiceToken {
  id: string;
  type: 'ServiceToken';
  token?: string;
  name: string;
  created_at: string;
}

export interface IServiceTokenAccess {
  id: string;
  type: 'ServiceTokenAccess';
  resource: 'organization' | 'database';
  resource_id: string;
  resource_name: string;
  accesses: string[];
}

export interface IWebhook {
  id: string;
  type: 'Webhook';
  url: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  events: string[];
  secret?: string;
}

export interface IOrganizationMember {
  id: string;
  type: 'OrganizationMember';
  name?: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  teams?: {
    id: string;
    name: string;
  }[];
}

export interface IRegion {
  id: string;
  type: 'Region';
  slug: string;
  display_name: string;
  location: string;
  provider: string;
  enabled: boolean;
}

export interface IUser {
  id: string;
  type: 'User';
  name?: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  two_factor_auth_enabled?: boolean;
  managed?: boolean;
  directory_managed?: boolean;
}

export interface IAuditLog {
  id: string;
  type: 'AuditLog';
  action: string;
  actor_id?: string;
  actor_type?: string;
  actor_display_name?: string;
  auditable_id?: string;
  auditable_type?: string;
  auditable_display_name?: string;
  target_id?: string;
  target_type?: string;
  target_display_name?: string;
  location?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface IDeployOperation {
  id: string;
  type: 'DeployOperation';
  deploy_request_number: number;
  state: string;
  created_at: string;
  updated_at: string;
  finished_at?: string;
  operation_type: string;
  eta_seconds?: number;
  progress_percentage?: number;
  table_name?: string;
  keyspace_name?: string;
}

export interface ISchemaDiff {
  type: 'SchemaDiff';
  raw: string;
  lint_errors?: string[];
}

export interface ISchemaLint {
  type: 'SchemaLint';
  errors: string[];
}

export interface IWebhookEvent {
  id: string;
  type: string;
  created_at: string;
  database?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  deploy_request?: {
    id: string;
    number: number;
  };
  [key: string]: unknown;
}
