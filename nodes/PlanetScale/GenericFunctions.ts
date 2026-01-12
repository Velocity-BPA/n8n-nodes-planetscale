/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IRequestOptions,
  IWebhookFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://api.planetscale.com/v1';

export async function planetScaleApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('planetScaleApi');

  let authHeader: string;
  if (credentials.authType === 'serviceToken') {
    authHeader = `${credentials.serviceTokenId}:${credentials.serviceToken}`;
  } else {
    authHeader = `Bearer ${credentials.accessToken}`;
  }

  const options: IRequestOptions = {
    method,
    uri: `${BASE_URL}${endpoint}`,
    headers: {
      Authorization: authHeader,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await this.helpers.request(options);
    return response as IDataObject;
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };

    if (err.statusCode === 429) {
      throw new NodeOperationError(
        this.getNode(),
        'Rate limit exceeded. Maximum 600 requests per minute.',
        { description: 'Please wait before making additional requests.' },
      );
    }

    if (err.statusCode === 401) {
      throw new NodeOperationError(
        this.getNode(),
        'Invalid credentials. Please check your PlanetScale API credentials.',
        { description: 'Verify your service token ID and secret, or OAuth access token.' },
      );
    }

    if (err.statusCode === 403) {
      throw new NodeOperationError(
        this.getNode(),
        'Insufficient permissions. Your service token may not have the required access.',
        { description: 'Check the service token permissions in the PlanetScale dashboard.' },
      );
    }

    if (err.statusCode === 404) {
      throw new NodeOperationError(
        this.getNode(),
        'Resource not found. The requested resource does not exist.',
        { description: 'Verify the organization, database, or branch name is correct.' },
      );
    }

    if (err.statusCode === 409) {
      throw new NodeOperationError(this.getNode(), 'Resource conflict. The resource already exists.', {
        description: err.message || 'A resource with this name may already exist.',
      });
    }

    if (err.statusCode === 422) {
      throw new NodeOperationError(this.getNode(), 'Validation error. The request parameters are invalid.', {
        description: err.message || 'Check the input parameters and try again.',
      });
    }

    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

export async function planetScaleApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let cursor: string | undefined;

  do {
    const qs: IDataObject = { ...query };
    if (cursor) {
      qs.starting_after = cursor;
    }

    const response = await planetScaleApiRequest.call(this, method, endpoint, body, qs);

    if (response.data && Array.isArray(response.data)) {
      returnData.push(...(response.data as IDataObject[]));
    }

    // Update cursor for next page
    if (response.has_next && response.cursor_end) {
      cursor = response.cursor_end as string;
    } else {
      cursor = undefined;
    }
  } while (cursor);

  return returnData;
}

export function validateOrganizationName(organizationName: string): string {
  if (!organizationName || organizationName.trim() === '') {
    throw new Error('Organization name is required');
  }
  return organizationName.trim().toLowerCase();
}

export function validateDatabaseName(databaseName: string): string {
  if (!databaseName || databaseName.trim() === '') {
    throw new Error('Database name is required');
  }
  return databaseName.trim().toLowerCase();
}

export function validateBranchName(branchName: string): string {
  if (!branchName || branchName.trim() === '') {
    throw new Error('Branch name is required');
  }
  return branchName.trim().toLowerCase();
}

export function buildEndpoint(parts: string[]): string {
  return '/' + parts.filter((p) => p).join('/');
}

export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
}
