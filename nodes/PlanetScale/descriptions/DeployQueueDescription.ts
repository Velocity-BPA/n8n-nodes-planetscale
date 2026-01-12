/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const deployQueueOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['deployQueue'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get the current deploy queue status',
        action: 'Get deploy queue',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List items in the deploy queue',
        action: 'List deploy queue items',
      },
    ],
    default: 'get',
  },
];

export const deployQueueFields: INodeProperties[] = [
  // ----------------------------------
  //      deployQueue: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['deployQueue'],
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
        resource: ['deployQueue'],
      },
    },
    description: 'The name of the database',
  },
];
