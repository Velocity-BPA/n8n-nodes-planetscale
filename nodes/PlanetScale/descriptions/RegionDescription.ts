/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const regionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['region'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get region details',
        action: 'Get region',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many regions',
        action: 'Get many regions',
      },
    ],
    default: 'getMany',
  },
];

export const regionFields: INodeProperties[] = [
  // ----------------------------------
  //         region: get
  // ----------------------------------
  {
    displayName: 'Region Slug',
    name: 'regionSlug',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'us-east',
    displayOptions: {
      show: {
        resource: ['region'],
        operation: ['get'],
      },
    },
    description: 'The slug of the region (e.g., us-east, eu-west)',
  },

  // ----------------------------------
  //         region: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['region'],
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
        resource: ['region'],
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
        resource: ['region'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Provider',
        name: 'provider',
        type: 'options',
        options: [
          { name: 'AWS', value: 'aws' },
          { name: 'GCP', value: 'gcp' },
        ],
        default: '',
        description: 'Filter by cloud provider',
      },
    ],
  },
];
