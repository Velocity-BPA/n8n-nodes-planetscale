/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const passwordOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['password'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new password/connection credential',
        action: 'Create password',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a password',
        action: 'Delete password',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get password details',
        action: 'Get password',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many passwords',
        action: 'Get many passwords',
      },
      {
        name: 'Renew',
        value: 'renew',
        description: 'Renew an expiring password',
        action: 'Renew password',
      },
    ],
    default: 'getMany',
  },
];

export const passwordFields: INodeProperties[] = [
  // ----------------------------------
  //         password: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['password'],
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
        resource: ['password'],
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
        resource: ['password'],
      },
    },
    description: 'The name of the branch',
  },

  // ----------------------------------
  //         password: create
  // ----------------------------------
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'A name/label for the password',
      },
      {
        displayName: 'Replica',
        name: 'replica',
        type: 'boolean',
        default: false,
        description: 'Whether to connect to read replica',
      },
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Reader', value: 'reader' },
          { name: 'Writer', value: 'writer' },
          { name: 'Read/Write', value: 'readwriter' },
        ],
        default: 'admin',
        description: 'The role for the password',
      },
      {
        displayName: 'TTL (Minutes)',
        name: 'ttl',
        type: 'number',
        default: 0,
        description: 'Time-to-live in minutes (0 for non-expiring)',
      },
    ],
  },

  // ----------------------------------
  //     password: get, delete, renew
  // ----------------------------------
  {
    displayName: 'Password ID',
    name: 'passwordId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['get', 'delete', 'renew'],
      },
    },
    description: 'The ID of the password',
  },

  // ----------------------------------
  //         password: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['password'],
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
        resource: ['password'],
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

  // ----------------------------------
  //         password: renew
  // ----------------------------------
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['renew'],
      },
    },
    options: [
      {
        displayName: 'Read Only Region Slug',
        name: 'read_only_region_slug',
        type: 'string',
        default: '',
        description: 'The read-only region slug for the renewed password',
      },
    ],
  },
];
