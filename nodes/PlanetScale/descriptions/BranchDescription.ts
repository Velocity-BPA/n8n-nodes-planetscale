/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const branchOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['branch'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new branch',
        action: 'Create branch',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a branch',
        action: 'Delete branch',
      },
      {
        name: 'Demote',
        value: 'demote',
        description: 'Demote production branch to development',
        action: 'Demote branch',
      },
      {
        name: 'Disable Safe Migrations',
        value: 'disableSafeMigrations',
        description: 'Disable safe migrations on branch',
        action: 'Disable safe migrations',
      },
      {
        name: 'Enable Safe Migrations',
        value: 'enableSafeMigrations',
        description: 'Enable safe migrations on branch',
        action: 'Enable safe migrations',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get branch details',
        action: 'Get branch',
      },
      {
        name: 'Get Diff',
        value: 'getDiff',
        description: 'Get schema diff between branches',
        action: 'Get schema diff',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many branches',
        action: 'Get many branches',
      },
      {
        name: 'Get Schema',
        value: 'getSchema',
        description: 'Get branch schema',
        action: 'Get branch schema',
      },
      {
        name: 'Lint Schema',
        value: 'lintSchema',
        description: 'Lint branch schema',
        action: 'Lint schema',
      },
      {
        name: 'Promote',
        value: 'promote',
        description: 'Promote branch to production',
        action: 'Promote branch',
      },
    ],
    default: 'getMany',
  },
];

export const branchFields: INodeProperties[] = [
  // ----------------------------------
  //         branch: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
      },
    },
    description: 'The slug/name of the organization',
  },
  {
    displayName: 'Database Name',
    name: 'databaseName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
      },
    },
    description: 'The name of the database',
  },

  // ----------------------------------
  //         branch: create
  // ----------------------------------
  {
    displayName: 'Branch Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
      },
    },
    description: 'The name for the new branch',
  },
  {
    displayName: 'Parent Branch',
    name: 'parentBranch',
    type: 'string',
    required: true,
    default: 'main',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
      },
    },
    description: 'The name of the parent branch to fork from',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Backup ID',
        name: 'backup_id',
        type: 'string',
        default: '',
        description: 'Backup ID to restore from',
      },
      {
        displayName: 'Region',
        name: 'region',
        type: 'string',
        default: '',
        description: 'The region slug for the branch',
      },
      {
        displayName: 'Seed Data',
        name: 'seed_data',
        type: 'string',
        default: '',
        description: 'Seed data option',
      },
    ],
  },

  // ----------------------------------
  //     branch: get, delete, promote, demote, schema ops
  // ----------------------------------
  {
    displayName: 'Branch Name',
    name: 'branchName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: [
          'get',
          'delete',
          'promote',
          'demote',
          'enableSafeMigrations',
          'disableSafeMigrations',
          'getSchema',
          'lintSchema',
        ],
      },
    },
    description: 'The name of the branch',
  },

  // ----------------------------------
  //         branch: getDiff
  // ----------------------------------
  {
    displayName: 'Source Branch',
    name: 'sourceBranch',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getDiff'],
      },
    },
    description: 'The source branch name for the diff',
  },
  {
    displayName: 'Target Branch',
    name: 'targetBranch',
    type: 'string',
    required: true,
    default: 'main',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getDiff'],
      },
    },
    description: 'The target branch name for the diff',
  },

  // ----------------------------------
  //         branch: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getMany'],
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
        resource: ['branch'],
        operation: ['getMany'],
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
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Production Only',
        name: 'production',
        type: 'boolean',
        default: false,
        description: 'Whether to only return production branches',
      },
    ],
  },

  // ----------------------------------
  //         branch: getSchema
  // ----------------------------------
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['branch'],
        operation: ['getSchema'],
      },
    },
    options: [
      {
        displayName: 'Keyspace',
        name: 'keyspace',
        type: 'string',
        default: '',
        description: 'The keyspace to get schema for',
      },
    ],
  },
];
