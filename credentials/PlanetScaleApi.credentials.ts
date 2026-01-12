/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class PlanetScaleApi implements ICredentialType {
  name = 'planetScaleApi';
  displayName = 'PlanetScale API';
  documentationUrl = 'https://docs.planetscale.com/docs/concepts/service-tokens';
  properties: INodeProperties[] = [
    {
      displayName: 'Authentication Type',
      name: 'authType',
      type: 'options',
      options: [
        {
          name: 'Service Token',
          value: 'serviceToken',
        },
        {
          name: 'OAuth',
          value: 'oauth',
        },
      ],
      default: 'serviceToken',
    },
    {
      displayName: 'Service Token ID',
      name: 'serviceTokenId',
      type: 'string',
      default: '',
      placeholder: 'e.g., abcd1234efgh5678',
      displayOptions: {
        show: {
          authType: ['serviceToken'],
        },
      },
      description: 'The ID of your PlanetScale service token',
    },
    {
      displayName: 'Service Token',
      name: 'serviceToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authType: ['serviceToken'],
        },
      },
      description: 'The secret value of your PlanetScale service token',
    },
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authType: ['oauth'],
        },
      },
      description: 'OAuth access token for PlanetScale',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization:
          '={{$credentials.authType === "serviceToken" ? $credentials.serviceTokenId + ":" + $credentials.serviceToken : "Bearer " + $credentials.accessToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.planetscale.com/v1',
      url: '/user',
      method: 'GET',
    },
  };
}
