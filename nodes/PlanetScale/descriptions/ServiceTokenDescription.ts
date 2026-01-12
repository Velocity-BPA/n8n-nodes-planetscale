/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const serviceTokenOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['serviceToken'],
      },
    },
    options: [
      {
        name: 'Add Access',
        value: 'addAccess',
        description: 'Add access permission to a token',
        action: 'Add token access',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new service token',
        action: 'Create service token',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a service token',
        action: 'Delete service token',
      },
      {
        name: 'Delete Access',
        value: 'deleteAccess',
        description: 'Remove access permission from a token',
        action: 'Delete token access',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get service token details',
        action: 'Get service token',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many service tokens',
        action: 'Get many service tokens',
      },
      {
        name: 'List Accesses',
        value: 'listAccesses',
        description: 'List access permissions for a token',
        action: 'List token accesses',
      },
    ],
    default: 'getMany',
  },
];

export const serviceTokenFields: INodeProperties[] = [
  // ----------------------------------
  //     serviceToken: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
      },
    },
    description: 'The slug/name of the organization',
  },

  // ----------------------------------
  //     serviceToken: create
  // ----------------------------------
  {
    displayName: 'Token Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['create'],
      },
    },
    description: 'The name for the new service token',
  },

  // ----------------------------------
  //     serviceToken: get, delete, listAccesses, addAccess, deleteAccess
  // ----------------------------------
  {
    displayName: 'Service Token ID',
    name: 'serviceTokenId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['get', 'delete', 'listAccesses', 'addAccess', 'deleteAccess'],
      },
    },
    description: 'The ID of the service token',
  },

  // ----------------------------------
  //     serviceToken: addAccess
  // ----------------------------------
  {
    displayName: 'Resource Type',
    name: 'resourceType',
    type: 'options',
    options: [
      { name: 'Organization', value: 'organization' },
      { name: 'Database', value: 'database' },
    ],
    required: true,
    default: 'database',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['addAccess'],
      },
    },
    description: 'The type of resource to grant access to',
  },
  {
    displayName: 'Resource Name',
    name: 'resourceName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['addAccess'],
      },
    },
    description: 'The name of the resource (organization or database name)',
  },
  {
    displayName: 'Permissions',
    name: 'accesses',
    type: 'multiOptions',
    options: [
      { name: 'Read Branch', value: 'read_branch' },
      { name: 'Create Branch', value: 'create_branch' },
      { name: 'Delete Branch', value: 'delete_branch' },
      { name: 'Connect Branch', value: 'connect_branch' },
      { name: 'Read Deploy Request', value: 'read_deploy_request' },
      { name: 'Create Deploy Request', value: 'create_deploy_request' },
      { name: 'Approve Deploy Request', value: 'approve_deploy_request' },
      { name: 'Read Comment', value: 'read_comment' },
      { name: 'Create Comment', value: 'create_comment' },
      { name: 'Read Database', value: 'read_database' },
      { name: 'Write Database', value: 'write_database' },
      { name: 'Delete Database', value: 'delete_database' },
      { name: 'Read Organization', value: 'read_organization' },
      { name: 'Write Organization', value: 'write_organization' },
    ],
    required: true,
    default: [],
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['addAccess'],
      },
    },
    description: 'The permissions to grant',
  },

  // ----------------------------------
  //     serviceToken: deleteAccess
  // ----------------------------------
  {
    displayName: 'Access ID',
    name: 'accessId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['deleteAccess'],
      },
    },
    description: 'The ID of the access permission to delete',
  },

  // ----------------------------------
  //     serviceToken: getMany, listAccesses
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['serviceToken'],
        operation: ['getMany', 'listAccesses'],
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
        resource: ['serviceToken'],
        operation: ['getMany', 'listAccesses'],
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
