/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationMemberOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['organizationMember'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get member details',
        action: 'Get member',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many members',
        action: 'Get many members',
      },
      {
        name: 'Invite',
        value: 'invite',
        description: 'Invite a new member',
        action: 'Invite member',
      },
      {
        name: 'Remove',
        value: 'remove',
        description: 'Remove member from organization',
        action: 'Remove member',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update member role',
        action: 'Update member',
      },
    ],
    default: 'getMany',
  },
];

export const organizationMemberFields: INodeProperties[] = [
  // ----------------------------------
  //    organizationMember: common
  // ----------------------------------
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organizationMember'],
      },
    },
    description: 'The slug/name of the organization',
  },

  // ----------------------------------
  //    organizationMember: invite
  // ----------------------------------
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organizationMember'],
        operation: ['invite'],
      },
    },
    description: 'The email address to invite',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['organizationMember'],
        operation: ['invite'],
      },
    },
    options: [
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Member', value: 'member' },
        ],
        default: 'member',
        description: 'The role for the new member',
      },
      {
        displayName: 'Team IDs',
        name: 'team_ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of team IDs to add member to',
      },
    ],
  },

  // ----------------------------------
  //    organizationMember: get, update, remove
  // ----------------------------------
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['organizationMember'],
        operation: ['get', 'update', 'remove'],
      },
    },
    description: 'The ID of the member',
  },

  // ----------------------------------
  //    organizationMember: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['organizationMember'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Role',
        name: 'role',
        type: 'options',
        options: [
          { name: 'Admin', value: 'admin' },
          { name: 'Member', value: 'member' },
        ],
        default: 'member',
        description: 'The role for the member',
      },
    ],
  },

  // ----------------------------------
  //    organizationMember: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['organizationMember'],
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
        resource: ['organizationMember'],
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
