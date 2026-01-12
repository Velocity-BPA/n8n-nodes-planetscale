/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
  planetScaleApiRequest,
  planetScaleApiRequestAllItems,
  validateOrganizationName,
  validateDatabaseName,
  validateBranchName,
  buildEndpoint,
  cleanObject,
} from './GenericFunctions';

import {
  organizationOperations,
  organizationFields,
} from './descriptions/OrganizationDescription';
import { databaseOperations, databaseFields } from './descriptions/DatabaseDescription';
import { branchOperations, branchFields } from './descriptions/BranchDescription';
import {
  deployRequestOperations,
  deployRequestFields,
} from './descriptions/DeployRequestDescription';
import { passwordOperations, passwordFields } from './descriptions/PasswordDescription';
import { backupOperations, backupFields } from './descriptions/BackupDescription';
import { deployQueueOperations, deployQueueFields } from './descriptions/DeployQueueDescription';
import {
  serviceTokenOperations,
  serviceTokenFields,
} from './descriptions/ServiceTokenDescription';
import { webhookOperations, webhookFields } from './descriptions/WebhookDescription';
import {
  organizationMemberOperations,
  organizationMemberFields,
} from './descriptions/OrganizationMemberDescription';
import { regionOperations, regionFields } from './descriptions/RegionDescription';
import { userOperations, userFields } from './descriptions/UserDescription';

// Emit licensing notice once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeEmitted = false;

function emitLicensingNotice(): void {
  if (!licensingNoticeEmitted) {
    console.warn(LICENSING_NOTICE);
    licensingNoticeEmitted = true;
  }
}

export class PlanetScale implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'PlanetScale',
    name: 'planetScale',
    icon: 'file:planetscale.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      'Interact with PlanetScale serverless MySQL database platform for branch workflows, deploy requests, and database management',
    defaults: {
      name: 'PlanetScale',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'planetScaleApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Backup', value: 'backup' },
          { name: 'Branch', value: 'branch' },
          { name: 'Database', value: 'database' },
          { name: 'Deploy Queue', value: 'deployQueue' },
          { name: 'Deploy Request', value: 'deployRequest' },
          { name: 'Organization', value: 'organization' },
          { name: 'Organization Member', value: 'organizationMember' },
          { name: 'Password', value: 'password' },
          { name: 'Region', value: 'region' },
          { name: 'Service Token', value: 'serviceToken' },
          { name: 'User', value: 'user' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'database',
      },
      ...organizationOperations,
      ...organizationFields,
      ...databaseOperations,
      ...databaseFields,
      ...branchOperations,
      ...branchFields,
      ...deployRequestOperations,
      ...deployRequestFields,
      ...passwordOperations,
      ...passwordFields,
      ...backupOperations,
      ...backupFields,
      ...deployQueueOperations,
      ...deployQueueFields,
      ...serviceTokenOperations,
      ...serviceTokenFields,
      ...webhookOperations,
      ...webhookFields,
      ...organizationMemberOperations,
      ...organizationMemberFields,
      ...regionOperations,
      ...regionFields,
      ...userOperations,
      ...userFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    emitLicensingNotice();

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        // Organization operations
        if (resource === 'organization') {
          responseData = await executeOrganizationOperation.call(this, operation, i);
        }

        // Database operations
        else if (resource === 'database') {
          responseData = await executeDatabaseOperation.call(this, operation, i);
        }

        // Branch operations
        else if (resource === 'branch') {
          responseData = await executeBranchOperation.call(this, operation, i);
        }

        // Deploy Request operations
        else if (resource === 'deployRequest') {
          responseData = await executeDeployRequestOperation.call(this, operation, i);
        }

        // Password operations
        else if (resource === 'password') {
          responseData = await executePasswordOperation.call(this, operation, i);
        }

        // Backup operations
        else if (resource === 'backup') {
          responseData = await executeBackupOperation.call(this, operation, i);
        }

        // Deploy Queue operations
        else if (resource === 'deployQueue') {
          responseData = await executeDeployQueueOperation.call(this, operation, i);
        }

        // Service Token operations
        else if (resource === 'serviceToken') {
          responseData = await executeServiceTokenOperation.call(this, operation, i);
        }

        // Webhook operations
        else if (resource === 'webhook') {
          responseData = await executeWebhookOperation.call(this, operation, i);
        }

        // Organization Member operations
        else if (resource === 'organizationMember') {
          responseData = await executeOrganizationMemberOperation.call(this, operation, i);
        }

        // Region operations
        else if (resource === 'region') {
          responseData = await executeRegionOperation.call(this, operation, i);
        }

        // User operations
        else if (resource === 'user') {
          responseData = await executeUserOperation.call(this, operation, i);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

// Organization operations
async function executeOrganizationOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const endpoint = '/organizations';

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'get') {
    const organizationName = validateOrganizationName(
      this.getNodeParameter('organizationName', itemIndex) as string,
    );
    const endpoint = buildEndpoint(['organizations', organizationName]);
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'listRegions') {
    const organizationName = validateOrganizationName(
      this.getNodeParameter('organizationName', itemIndex) as string,
    );
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const endpoint = buildEndpoint(['organizations', organizationName, 'regions']);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'listAuditLogs') {
    const organizationName = validateOrganizationName(
      this.getNodeParameter('organizationName', itemIndex) as string,
    );
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
    const endpoint = buildEndpoint(['organizations', organizationName, 'audit-logs']);
    const query = cleanObject(filters);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint, {}, query);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    query.limit = limit;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, query);
    return (response.data as IDataObject[]) || [];
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for organization resource`,
  );
}

// Database operations
async function executeDatabaseOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const endpoint = buildEndpoint(['organizations', organizationName, 'databases']);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const name = this.getNodeParameter('name', itemIndex) as string;
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const endpoint = buildEndpoint(['organizations', organizationName, 'databases']);
    const body = cleanObject({ name, ...additionalFields });
    return await planetScaleApiRequest.call(this, 'POST', endpoint, body);
  }

  if (operation === 'get') {
    const databaseName = validateDatabaseName(
      this.getNodeParameter('databaseName', itemIndex) as string,
    );
    const endpoint = buildEndpoint(['organizations', organizationName, 'databases', databaseName]);
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'update') {
    const databaseName = validateDatabaseName(
      this.getNodeParameter('databaseName', itemIndex) as string,
    );
    const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
    const endpoint = buildEndpoint(['organizations', organizationName, 'databases', databaseName]);
    const body = cleanObject(updateFields);
    return await planetScaleApiRequest.call(this, 'PATCH', endpoint, body);
  }

  if (operation === 'delete') {
    const databaseName = validateDatabaseName(
      this.getNodeParameter('databaseName', itemIndex) as string,
    );
    const endpoint = buildEndpoint(['organizations', organizationName, 'databases', databaseName]);
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: databaseName };
  }

  if (operation === 'listRegions') {
    const databaseName = validateDatabaseName(
      this.getNodeParameter('databaseName', itemIndex) as string,
    );
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const endpoint = buildEndpoint([
      'organizations',
      organizationName,
      'databases',
      databaseName,
      'regions',
    ]);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for database resource`,
  );
}

// Branch operations
async function executeBranchOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );
  const databaseName = validateDatabaseName(
    this.getNodeParameter('databaseName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint([
    'organizations',
    organizationName,
    'databases',
    databaseName,
    'branches',
  ]);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
    const query = cleanObject(filters);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint, {}, query);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    query.limit = limit;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, query);
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const name = this.getNodeParameter('name', itemIndex) as string;
    const parentBranch = this.getNodeParameter('parentBranch', itemIndex) as string;
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const body = cleanObject({ name, parent_branch: parentBranch, ...additionalFields });
    return await planetScaleApiRequest.call(this, 'POST', baseEndpoint, body);
  }

  if (operation === 'get') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'delete') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: branchName };
  }

  if (operation === 'promote') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}/promote`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'demote') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}/demote`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'enableSafeMigrations') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}/safe-migrations`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'disableSafeMigrations') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}/safe-migrations`;
    return await planetScaleApiRequest.call(this, 'DELETE', endpoint);
  }

  if (operation === 'getSchema') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
    const endpoint = `${baseEndpoint}/${branchName}/schema`;
    const query = cleanObject(options);
    return await planetScaleApiRequest.call(this, 'GET', endpoint, {}, query);
  }

  if (operation === 'lintSchema') {
    const branchName = validateBranchName(
      this.getNodeParameter('branchName', itemIndex) as string,
    );
    const endpoint = `${baseEndpoint}/${branchName}/schema/lint`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'getDiff') {
    const sourceBranch = this.getNodeParameter('sourceBranch', itemIndex) as string;
    const targetBranch = this.getNodeParameter('targetBranch', itemIndex) as string;
    const endpoint = buildEndpoint([
      'organizations',
      organizationName,
      'databases',
      databaseName,
      'branches',
      sourceBranch,
      'diff',
    ]);
    return await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { branch: targetBranch });
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for branch resource`,
  );
}

// Deploy Request operations
async function executeDeployRequestOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );
  const databaseName = validateDatabaseName(
    this.getNodeParameter('databaseName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint([
    'organizations',
    organizationName,
    'databases',
    databaseName,
    'deploy-requests',
  ]);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
    const query = cleanObject(filters);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint, {}, query);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    query.limit = limit;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, query);
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const branch = this.getNodeParameter('branch', itemIndex) as string;
    const intoBranch = this.getNodeParameter('intoBranch', itemIndex) as string;
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const body = cleanObject({ branch, into_branch: intoBranch, ...additionalFields });
    return await planetScaleApiRequest.call(this, 'POST', baseEndpoint, body);
  }

  if (operation === 'get') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'update') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}`;
    const body = cleanObject(updateFields);
    return await planetScaleApiRequest.call(this, 'PATCH', endpoint, body);
  }

  if (operation === 'close') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}/close`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'deploy') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}/deploy`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'queue') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}/queue`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'getDeployOperations') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}/operations`;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'skipRevertPeriod') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}/skip-revert-period`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  if (operation === 'getDeploymentDiff') {
    const deployRequestNumber = this.getNodeParameter('deployRequestNumber', itemIndex) as number;
    const endpoint = `${baseEndpoint}/${deployRequestNumber}/diff`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for deployRequest resource`,
  );
}

// Password operations
async function executePasswordOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );
  const databaseName = validateDatabaseName(
    this.getNodeParameter('databaseName', itemIndex) as string,
  );
  const branchName = validateBranchName(
    this.getNodeParameter('branchName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint([
    'organizations',
    organizationName,
    'databases',
    databaseName,
    'branches',
    branchName,
    'passwords',
  ]);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const body = cleanObject(additionalFields);
    return await planetScaleApiRequest.call(this, 'POST', baseEndpoint, body);
  }

  if (operation === 'get') {
    const passwordId = this.getNodeParameter('passwordId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${passwordId}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'delete') {
    const passwordId = this.getNodeParameter('passwordId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${passwordId}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: passwordId };
  }

  if (operation === 'renew') {
    const passwordId = this.getNodeParameter('passwordId', itemIndex) as string;
    const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
    const endpoint = `${baseEndpoint}/${passwordId}/renew`;
    const body = cleanObject(options);
    return await planetScaleApiRequest.call(this, 'POST', endpoint, body);
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for password resource`,
  );
}

// Backup operations
async function executeBackupOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );
  const databaseName = validateDatabaseName(
    this.getNodeParameter('databaseName', itemIndex) as string,
  );
  const branchName = validateBranchName(
    this.getNodeParameter('branchName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint([
    'organizations',
    organizationName,
    'databases',
    databaseName,
    'branches',
    branchName,
    'backups',
  ]);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const body = cleanObject(additionalFields);
    return await planetScaleApiRequest.call(this, 'POST', baseEndpoint, body);
  }

  if (operation === 'get') {
    const backupId = this.getNodeParameter('backupId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${backupId}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'delete') {
    const backupId = this.getNodeParameter('backupId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${backupId}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: backupId };
  }

  if (operation === 'restore') {
    const backupId = this.getNodeParameter('backupId', itemIndex) as string;
    const newBranchName = this.getNodeParameter('newBranchName', itemIndex) as string;
    // Create a new branch from the backup
    const branchEndpoint = buildEndpoint([
      'organizations',
      organizationName,
      'databases',
      databaseName,
      'branches',
    ]);
    const body = { name: newBranchName, backup_id: backupId };
    return await planetScaleApiRequest.call(this, 'POST', branchEndpoint, body);
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for backup resource`,
  );
}

// Deploy Queue operations
async function executeDeployQueueOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );
  const databaseName = validateDatabaseName(
    this.getNodeParameter('databaseName', itemIndex) as string,
  );

  const endpoint = buildEndpoint([
    'organizations',
    organizationName,
    'databases',
    databaseName,
    'deploy-queue',
  ]);

  if (operation === 'get' || operation === 'list') {
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for deployQueue resource`,
  );
}

// Service Token operations
async function executeServiceTokenOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint(['organizations', organizationName, 'service-tokens']);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const name = this.getNodeParameter('name', itemIndex) as string;
    const body = { name };
    return await planetScaleApiRequest.call(this, 'POST', baseEndpoint, body);
  }

  if (operation === 'get') {
    const serviceTokenId = this.getNodeParameter('serviceTokenId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${serviceTokenId}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'delete') {
    const serviceTokenId = this.getNodeParameter('serviceTokenId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${serviceTokenId}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: serviceTokenId };
  }

  if (operation === 'listAccesses') {
    const serviceTokenId = this.getNodeParameter('serviceTokenId', itemIndex) as string;
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const endpoint = `${baseEndpoint}/${serviceTokenId}/accesses`;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', endpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', endpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'addAccess') {
    const serviceTokenId = this.getNodeParameter('serviceTokenId', itemIndex) as string;
    const resourceType = this.getNodeParameter('resourceType', itemIndex) as string;
    const resourceName = this.getNodeParameter('resourceName', itemIndex) as string;
    const accesses = this.getNodeParameter('accesses', itemIndex) as string[];
    const endpoint = `${baseEndpoint}/${serviceTokenId}/accesses`;
    const body = { resource: resourceType, resource_name: resourceName, accesses };
    return await planetScaleApiRequest.call(this, 'POST', endpoint, body);
  }

  if (operation === 'deleteAccess') {
    const serviceTokenId = this.getNodeParameter('serviceTokenId', itemIndex) as string;
    const accessId = this.getNodeParameter('accessId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${serviceTokenId}/accesses/${accessId}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: accessId };
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for serviceToken resource`,
  );
}

// Webhook operations
async function executeWebhookOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );
  const databaseName = validateDatabaseName(
    this.getNodeParameter('databaseName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint([
    'organizations',
    organizationName,
    'databases',
    databaseName,
    'webhooks',
  ]);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'create') {
    const url = this.getNodeParameter('url', itemIndex) as string;
    const events = this.getNodeParameter('events', itemIndex) as string[];
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
    const body = cleanObject({ url, events, ...additionalFields });
    return await planetScaleApiRequest.call(this, 'POST', baseEndpoint, body);
  }

  if (operation === 'get') {
    const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${webhookId}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'update') {
    const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
    const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
    const endpoint = `${baseEndpoint}/${webhookId}`;
    const body = cleanObject(updateFields);
    return await planetScaleApiRequest.call(this, 'PATCH', endpoint, body);
  }

  if (operation === 'delete') {
    const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${webhookId}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, deleted: webhookId };
  }

  if (operation === 'test') {
    const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${webhookId}/test`;
    return await planetScaleApiRequest.call(this, 'POST', endpoint);
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for webhook resource`,
  );
}

// Organization Member operations
async function executeOrganizationMemberOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const organizationName = validateOrganizationName(
    this.getNodeParameter('organizationName', itemIndex) as string,
  );

  const baseEndpoint = buildEndpoint(['organizations', organizationName, 'members']);

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, { limit });
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'invite') {
    const email = this.getNodeParameter('email', itemIndex) as string;
    const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

    // Handle team_ids conversion from string to array
    if (additionalFields.team_ids && typeof additionalFields.team_ids === 'string') {
      additionalFields.team_ids = (additionalFields.team_ids as string)
        .split(',')
        .map((id) => id.trim());
    }

    const endpoint = buildEndpoint(['organizations', organizationName, 'invitations']);
    const body = cleanObject({ email, ...additionalFields });
    return await planetScaleApiRequest.call(this, 'POST', endpoint, body);
  }

  if (operation === 'get') {
    const memberId = this.getNodeParameter('memberId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${memberId}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  if (operation === 'update') {
    const memberId = this.getNodeParameter('memberId', itemIndex) as string;
    const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
    const endpoint = `${baseEndpoint}/${memberId}`;
    const body = cleanObject(updateFields);
    return await planetScaleApiRequest.call(this, 'PATCH', endpoint, body);
  }

  if (operation === 'remove') {
    const memberId = this.getNodeParameter('memberId', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${memberId}`;
    await planetScaleApiRequest.call(this, 'DELETE', endpoint);
    return { success: true, removed: memberId };
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for organizationMember resource`,
  );
}

// Region operations
async function executeRegionOperation(
  this: IExecuteFunctions,
  operation: string,
  itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  const baseEndpoint = '/regions';

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
    const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
    const query = cleanObject(filters);

    if (returnAll) {
      return await planetScaleApiRequestAllItems.call(this, 'GET', baseEndpoint, {}, query);
    }

    const limit = this.getNodeParameter('limit', itemIndex) as number;
    query.limit = limit;
    const response = await planetScaleApiRequest.call(this, 'GET', baseEndpoint, {}, query);
    return (response.data as IDataObject[]) || [];
  }

  if (operation === 'get') {
    const regionSlug = this.getNodeParameter('regionSlug', itemIndex) as string;
    const endpoint = `${baseEndpoint}/${regionSlug}`;
    return await planetScaleApiRequest.call(this, 'GET', endpoint);
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for region resource`,
  );
}

// User operations
async function executeUserOperation(
  this: IExecuteFunctions,
  operation: string,
  _itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
  if (operation === 'getCurrent') {
    return await planetScaleApiRequest.call(this, 'GET', '/user');
  }

  throw new NodeOperationError(
    this.getNode(),
    `The operation "${operation}" is not supported for user resource`,
  );
}
