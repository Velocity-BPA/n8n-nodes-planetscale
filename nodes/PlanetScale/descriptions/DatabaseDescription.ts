/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const databaseOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['database'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new database',
        action: 'Create database',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a database',
        action: 'Delete database',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get database details',
        action: 'Get database',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many databases',
        action: 'Get many databases',
      },
      {
        name: 'List Regions',
        value: 'listRegions',
        description: 'List regions where database is deployed',
        action: 'List database regions',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update database settings',
        action: 'Update database',
      },
    ],
    default: 'getMany',
  },
];

export const databaseFields: INodeProperties[] = [
  // ----------------------------------
  //         database: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
      },
    },
    description: 'The slug/name of the organization',
  },

  // ----------------------------------
  //         database: create
  // ----------------------------------
  {
    displayName: 'Database Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['create'],
      },
    },
    description: 'The name for the new database',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Cluster Size',
        name: 'cluster_size',
        type: 'options',
        options: [
          { name: 'PS-10', value: 'PS-10' },
          { name: 'PS-20', value: 'PS-20' },
          { name: 'PS-40', value: 'PS-40' },
          { name: 'PS-80', value: 'PS-80' },
          { name: 'PS-160', value: 'PS-160' },
          { name: 'PS-320', value: 'PS-320' },
          { name: 'PS-400', value: 'PS-400' },
        ],
        default: 'PS-10',
        description: 'The cluster size for the database',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes or description for the database',
      },
      {
        displayName: 'Plan',
        name: 'plan',
        type: 'options',
        options: [
          { name: 'Hobby', value: 'hobby' },
          { name: 'Scaler', value: 'scaler' },
          { name: 'Scaler Pro', value: 'scaler_pro' },
          { name: 'Enterprise', value: 'enterprise' },
        ],
        default: 'hobby',
        description: 'The plan for the database',
      },
      {
        displayName: 'Region',
        name: 'region',
        type: 'string',
        default: '',
        placeholder: 'us-east',
        description: 'The primary region slug for the database',
      },
    ],
  },

  // ----------------------------------
  //     database: get, delete, update, listRegions
  // ----------------------------------
  {
    displayName: 'Database Name',
    name: 'databaseName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['get', 'delete', 'update', 'listRegions'],
      },
    },
    description: 'The name of the database',
  },

  // ----------------------------------
  //         database: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Allow Data Branching',
        name: 'allow_data_branching',
        type: 'boolean',
        default: false,
        description: 'Whether to allow data branching',
      },
      {
        displayName: 'Automatic Migrations',
        name: 'automatic_migrations',
        type: 'boolean',
        default: false,
        description: 'Whether to enable automatic migrations',
      },
      {
        displayName: 'Default Branch',
        name: 'default_branch',
        type: 'string',
        default: '',
        description: 'The default branch name',
      },
      {
        displayName: 'Insights Raw Queries',
        name: 'insights_raw_queries',
        type: 'boolean',
        default: false,
        description: 'Whether to enable raw query insights',
      },
      {
        displayName: 'Migration Framework',
        name: 'migration_framework',
        type: 'options',
        options: [
          { name: 'None', value: '' },
          { name: 'Rails', value: 'rails' },
          { name: 'Phoenix', value: 'phoenix' },
          { name: 'Laravel', value: 'laravel' },
          { name: 'Django', value: 'django' },
          { name: 'Node.js', value: 'nodejs' },
          { name: 'Other', value: 'other' },
        ],
        default: '',
        description: 'The migration framework to use',
      },
      {
        displayName: 'Migration Table Name',
        name: 'migration_table_name',
        type: 'string',
        default: '',
        description: 'The name of the migrations table',
      },
      {
        displayName: 'Multiple Admins Required for Deletion',
        name: 'multiple_admins_required_for_deletion',
        type: 'boolean',
        default: false,
        description: 'Whether multiple admins are required to delete the database',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes or description for the database',
      },
      {
        displayName: 'Production Branch Web Console',
        name: 'production_branch_web_console',
        type: 'boolean',
        default: false,
        description: 'Whether to enable web console for production branch',
      },
      {
        displayName: 'Require Approval for Deploy',
        name: 'require_approval_for_deploy',
        type: 'boolean',
        default: false,
        description: 'Whether to require approval for deploy requests',
      },
      {
        displayName: 'Restrict Branch Region',
        name: 'restrict_branch_region',
        type: 'boolean',
        default: false,
        description: 'Whether to restrict branch regions',
      },
    ],
  },

  // ----------------------------------
  //         database: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['getMany', 'listRegions'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['database'],
        operation: ['getMany', 'listRegions'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 25,
    description: 'Max number of results to return',
  },
];
