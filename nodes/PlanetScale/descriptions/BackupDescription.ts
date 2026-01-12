/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const backupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['backup'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new backup',
        action: 'Create backup',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a backup',
        action: 'Delete backup',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get backup details',
        action: 'Get backup',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many backups',
        action: 'Get many backups',
      },
      {
        name: 'Restore',
        value: 'restore',
        description: 'Restore from backup to a new branch',
        action: 'Restore backup',
      },
    ],
    default: 'getMany',
  },
];

export const backupFields: INodeProperties[] = [
  // ----------------------------------
  //         backup: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['backup'],
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
        resource: ['backup'],
      },
    },
    description: 'The name of the database',
  },
  {
    displayName: 'Branch Name',
    name: 'branchName',
    type: 'string',
    required: true,
    default: 'main',
    displayOptions: {
      show: {
        resource: ['backup'],
      },
    },
    description: 'The name of the branch',
  },

  // ----------------------------------
  //         backup: create
  // ----------------------------------
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['backup'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'A name for the backup',
      },
      {
        displayName: 'Retention Unit',
        name: 'retention_unit',
        type: 'options',
        options: [
          { name: 'Day', value: 'day' },
          { name: 'Week', value: 'week' },
          { name: 'Month', value: 'month' },
          { name: 'Year', value: 'year' },
        ],
        default: 'day',
        description: 'The retention unit for the backup',
      },
      {
        displayName: 'Retention Value',
        name: 'retention_value',
        type: 'number',
        default: 7,
        description: 'The retention value for the backup',
      },
    ],
  },

  // ----------------------------------
  //     backup: get, delete, restore
  // ----------------------------------
  {
    displayName: 'Backup ID',
    name: 'backupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['backup'],
        operation: ['get', 'delete', 'restore'],
      },
    },
    description: 'The ID of the backup',
  },

  // ----------------------------------
  //         backup: restore
  // ----------------------------------
  {
    displayName: 'New Branch Name',
    name: 'newBranchName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['backup'],
        operation: ['restore'],
      },
    },
    description: 'The name for the new branch to restore to',
  },

  // ----------------------------------
  //         backup: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['backup'],
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
        resource: ['backup'],
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
];
