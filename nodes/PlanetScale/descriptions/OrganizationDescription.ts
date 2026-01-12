/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['organization'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get organization details',
        action: 'Get organization',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many organizations',
        action: 'Get many organizations',
      },
      {
        name: 'List Audit Logs',
        value: 'listAuditLogs',
        description: 'List audit logs for an organization',
        action: 'List audit logs',
      },
      {
        name: 'List Regions',
        value: 'listRegions',
        description: 'List available regions for an organization',
        action: 'List regions',
      },
    ],
    default: 'getMany',
  },
];

export const organizationFields: INodeProperties[] = [
  // ----------------------------------
  //         organization: get
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['get', 'listRegions', 'listAuditLogs'],
      },
    },
    description: 'The slug/name of the organization',
  },

  // ----------------------------------
  //    organization: listAuditLogs
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['getMany', 'listRegions', 'listAuditLogs'],
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
        resource: ['organization'],
        operation: ['getMany', 'listRegions', 'listAuditLogs'],
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
        resource: ['organization'],
        operation: ['listAuditLogs'],
      },
    },
    options: [
      {
        displayName: 'Action',
        name: 'action',
        type: 'string',
        default: '',
        description: 'Filter by action type',
      },
      {
        displayName: 'Actor ID',
        name: 'actor_id',
        type: 'string',
        default: '',
        description: 'Filter by actor ID',
      },
      {
        displayName: 'Auditable ID',
        name: 'auditable_id',
        type: 'string',
        default: '',
        description: 'Filter by auditable resource ID',
      },
      {
        displayName: 'Auditable Type',
        name: 'auditable_type',
        type: 'string',
        default: '',
        description: 'Filter by auditable resource type',
      },
    ],
  },
];
