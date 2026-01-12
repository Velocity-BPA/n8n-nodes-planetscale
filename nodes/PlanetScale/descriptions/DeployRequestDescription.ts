/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const deployRequestOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['deployRequest'],
      },
    },
    options: [
      {
        name: 'Close',
        value: 'close',
        description: 'Close/cancel a deploy request',
        action: 'Close deploy request',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new deploy request',
        action: 'Create deploy request',
      },
      {
        name: 'Deploy',
        value: 'deploy',
        description: 'Execute the deploy request',
        action: 'Execute deploy request',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get deploy request details',
        action: 'Get deploy request',
      },
      {
        name: 'Get Deployment Diff',
        value: 'getDeploymentDiff',
        description: 'Get the schema diff for the deploy',
        action: 'Get deployment diff',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many deploy requests',
        action: 'Get many deploy requests',
      },
      {
        name: 'Get Operations',
        value: 'getDeployOperations',
        description: 'List operations for a deploy',
        action: 'Get deploy operations',
      },
      {
        name: 'Queue',
        value: 'queue',
        description: 'Add deploy request to queue',
        action: 'Queue deploy request',
      },
      {
        name: 'Skip Revert Period',
        value: 'skipRevertPeriod',
        description: 'Skip the revert period',
        action: 'Skip revert period',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update deploy request',
        action: 'Update deploy request',
      },
    ],
    default: 'getMany',
  },
];

export const deployRequestFields: INodeProperties[] = [
  // ----------------------------------
  //      deployRequest: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['deployRequest'],
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
        resource: ['deployRequest'],
      },
    },
    description: 'The name of the database',
  },

  // ----------------------------------
  //      deployRequest: create
  // ----------------------------------
  {
    displayName: 'Branch',
    name: 'branch',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['deployRequest'],
        operation: ['create'],
      },
    },
    description: 'The source branch name',
  },
  {
    displayName: 'Into Branch',
    name: 'intoBranch',
    type: 'string',
    required: true,
    default: 'main',
    displayOptions: {
      show: {
        resource: ['deployRequest'],
        operation: ['create'],
      },
    },
    description: 'The target branch name (usually main)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['deployRequest'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Auto Cutover',
        name: 'auto_cutover',
        type: 'boolean',
        default: false,
        description: 'Whether to auto-cutover after deployment',
      },
      {
        displayName: 'Auto Delete Branch',
        name: 'auto_delete_branch',
        type: 'boolean',
        default: false,
        description: 'Whether to delete source branch after successful deploy',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes for the deploy request',
      },
    ],
  },

  // ----------------------------------
  //     deployRequest: get, update, close, deploy, queue, etc.
  // ----------------------------------
  {
    displayName: 'Deploy Request Number',
    name: 'deployRequestNumber',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['deployRequest'],
        operation: [
          'get',
          'update',
          'close',
          'deploy',
          'queue',
          'getDeployOperations',
          'skipRevertPeriod',
          'getDeploymentDiff',
        ],
      },
    },
    description: 'The deploy request number',
  },

  // ----------------------------------
  //      deployRequest: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['deployRequest'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Auto Cutover',
        name: 'auto_cutover',
        type: 'boolean',
        default: false,
        description: 'Whether to auto-cutover after deployment',
      },
      {
        displayName: 'Auto Delete Branch',
        name: 'auto_delete_branch',
        type: 'boolean',
        default: false,
        description: 'Whether to delete source branch after successful deploy',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes for the deploy request',
      },
    ],
  },

  // ----------------------------------
  //      deployRequest: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['deployRequest'],
        operation: ['getMany', 'getDeployOperations'],
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
        resource: ['deployRequest'],
        operation: ['getMany', 'getDeployOperations'],
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
        resource: ['deployRequest'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Branch',
        name: 'branch',
        type: 'string',
        default: '',
        description: 'Filter by source branch name',
      },
      {
        displayName: 'Into Branch',
        name: 'into_branch',
        type: 'string',
        default: '',
        description: 'Filter by target branch name',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Open', value: 'open' },
          { name: 'Closed', value: 'closed' },
          { name: 'Deployed', value: 'deployed' },
        ],
        default: 'open',
        description: 'Filter by deploy request state',
      },
    ],
  },
];
