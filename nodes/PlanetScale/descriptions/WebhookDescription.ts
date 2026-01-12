/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new webhook',
        action: 'Create webhook',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a webhook',
        action: 'Delete webhook',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get webhook details',
        action: 'Get webhook',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many webhooks',
        action: 'Get many webhooks',
      },
      {
        name: 'Test',
        value: 'test',
        description: 'Send a test webhook',
        action: 'Test webhook',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update webhook configuration',
        action: 'Update webhook',
      },
    ],
    default: 'getMany',
  },
];

export const webhookFields: INodeProperties[] = [
  // ----------------------------------
  //         webhook: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhook'],
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
        resource: ['webhook'],
      },
    },
    description: 'The name of the database',
  },

  // ----------------------------------
  //         webhook: create
  // ----------------------------------
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    description: 'The webhook URL endpoint',
  },
  {
    displayName: 'Events',
    name: 'events',
    type: 'multiOptions',
    options: [
      { name: 'Branch Created', value: 'branch.created' },
      { name: 'Branch Deleted', value: 'branch.deleted' },
      { name: 'Branch Ready', value: 'branch.ready' },
      { name: 'Branch Sleeping', value: 'branch.sleeping' },
      { name: 'Deploy Request Closed', value: 'deploy_request.closed' },
      { name: 'Deploy Request Completed', value: 'deploy_request.completed' },
      { name: 'Deploy Request Errored', value: 'deploy_request.errored' },
      { name: 'Deploy Request In Progress', value: 'deploy_request.in_progress' },
      { name: 'Deploy Request Opened', value: 'deploy_request.opened' },
      { name: 'Deploy Request Queued', value: 'deploy_request.queued' },
      { name: 'Deploy Request Schema Applied', value: 'deploy_request.schema_applied' },
    ],
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    description: 'The events to subscribe to',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the webhook is active',
      },
      {
        displayName: 'Secret',
        name: 'secret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Webhook signing secret for signature verification',
      },
    ],
  },

  // ----------------------------------
  //     webhook: get, delete, update, test
  // ----------------------------------
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['get', 'delete', 'update', 'test'],
      },
    },
    description: 'The ID of the webhook',
  },

  // ----------------------------------
  //         webhook: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the webhook is active',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          { name: 'Branch Created', value: 'branch.created' },
          { name: 'Branch Deleted', value: 'branch.deleted' },
          { name: 'Branch Ready', value: 'branch.ready' },
          { name: 'Branch Sleeping', value: 'branch.sleeping' },
          { name: 'Deploy Request Closed', value: 'deploy_request.closed' },
          { name: 'Deploy Request Completed', value: 'deploy_request.completed' },
          { name: 'Deploy Request Errored', value: 'deploy_request.errored' },
          { name: 'Deploy Request In Progress', value: 'deploy_request.in_progress' },
          { name: 'Deploy Request Opened', value: 'deploy_request.opened' },
          { name: 'Deploy Request Queued', value: 'deploy_request.queued' },
          { name: 'Deploy Request Schema Applied', value: 'deploy_request.schema_applied' },
        ],
        default: [],
        description: 'The events to subscribe to',
      },
      {
        displayName: 'Secret',
        name: 'secret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Webhook signing secret for signature verification',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        description: 'The webhook URL endpoint',
      },
    ],
  },

  // ----------------------------------
  //         webhook: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['webhook'],
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
        resource: ['webhook'],
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
