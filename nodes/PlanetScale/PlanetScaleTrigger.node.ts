/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { createHmac, timingSafeEqual } from 'crypto';
import { planetScaleApiRequest } from './GenericFunctions';

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

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = 'v1=' + hmac.digest('hex');
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
}

export class PlanetScaleTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'PlanetScale Trigger',
    name: 'planetScaleTrigger',
    icon: 'file:planetscale.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts the workflow when PlanetScale events occur (branches, deploy requests)',
    defaults: {
      name: 'PlanetScale Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'planetScaleApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Organization Name',
        name: 'organizationName',
        type: 'string',
        required: true,
        default: '',
        description: 'The name/slug of the PlanetScale organization',
      },
      {
        displayName: 'Database Name',
        name: 'databaseName',
        type: 'string',
        required: true,
        default: '',
        description: 'The name of the database to receive events from',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        options: [
          {
            name: 'Branch Created',
            value: 'branch.created',
            description: 'Triggered when a new branch is created',
          },
          {
            name: 'Branch Deleted',
            value: 'branch.deleted',
            description: 'Triggered when a branch is deleted',
          },
          {
            name: 'Branch Ready',
            value: 'branch.ready',
            description: 'Triggered when a branch is ready for use',
          },
          {
            name: 'Branch Sleeping',
            value: 'branch.sleeping',
            description: 'Triggered when a branch enters sleep mode',
          },
          {
            name: 'Deploy Request Closed',
            value: 'deploy_request.closed',
            description: 'Triggered when a deploy request is closed or cancelled',
          },
          {
            name: 'Deploy Request Completed',
            value: 'deploy_request.completed',
            description: 'Triggered when a deploy request completes successfully',
          },
          {
            name: 'Deploy Request Errored',
            value: 'deploy_request.errored',
            description: 'Triggered when a deploy request fails with an error',
          },
          {
            name: 'Deploy Request In Progress',
            value: 'deploy_request.in_progress',
            description: 'Triggered when a deploy request starts executing',
          },
          {
            name: 'Deploy Request Opened',
            value: 'deploy_request.opened',
            description: 'Triggered when a new deploy request is opened',
          },
          {
            name: 'Deploy Request Queued',
            value: 'deploy_request.queued',
            description: 'Triggered when a deploy request is added to the queue',
          },
          {
            name: 'Deploy Request Schema Applied',
            value: 'deploy_request.schema_applied',
            description: 'Triggered when schema changes are applied',
          },
        ],
        description: 'The events to listen for',
      },
      {
        displayName: 'Webhook Secret',
        name: 'webhookSecret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description:
          'Secret key for verifying webhook signatures. Leave empty to auto-generate.',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Verify Signature',
            name: 'verifySignature',
            type: 'boolean',
            default: true,
            description:
              'Whether to verify the webhook signature using HMAC-SHA256',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        emitLicensingNotice();

        const webhookData = this.getWorkflowStaticData('node');
        const webhookUrl = this.getNodeWebhookUrl('default');
        const organizationName = this.getNodeParameter(
          'organizationName',
        ) as string;
        const databaseName = this.getNodeParameter('databaseName') as string;

        if (!webhookData.webhookId) {
          return false;
        }

        const endpoint = `/organizations/${organizationName}/databases/${databaseName}/webhooks/${webhookData.webhookId}`;

        try {
          const response = await planetScaleApiRequest.call(
            this,
            'GET',
            endpoint,
          );

          if (response && response.url === webhookUrl) {
            return true;
          }
        } catch (error) {
          // Webhook doesn't exist
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        emitLicensingNotice();

        const webhookData = this.getWorkflowStaticData('node');
        const webhookUrl = this.getNodeWebhookUrl('default');
        const organizationName = this.getNodeParameter(
          'organizationName',
        ) as string;
        const databaseName = this.getNodeParameter('databaseName') as string;
        const events = this.getNodeParameter('events') as string[];
        let webhookSecret = this.getNodeParameter('webhookSecret') as string;

        // Generate a secret if not provided
        if (!webhookSecret) {
          webhookSecret =
            Math.random().toString(36).substring(2) +
            Math.random().toString(36).substring(2) +
            Math.random().toString(36).substring(2);
        }

        const endpoint = `/organizations/${organizationName}/databases/${databaseName}/webhooks`;

        const body = {
          url: webhookUrl,
          events,
          secret: webhookSecret,
          active: true,
        };

        try {
          const response = await planetScaleApiRequest.call(
            this,
            'POST',
            endpoint,
            body,
          );

          if (response.id) {
            webhookData.webhookId = response.id;
            webhookData.webhookSecret = webhookSecret;
            return true;
          }
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to create webhook: ${(error as Error).message}`,
          );
        }

        return false;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const organizationName = this.getNodeParameter(
          'organizationName',
        ) as string;
        const databaseName = this.getNodeParameter('databaseName') as string;

        if (!webhookData.webhookId) {
          return true;
        }

        const endpoint = `/organizations/${organizationName}/databases/${databaseName}/webhooks/${webhookData.webhookId}`;

        try {
          await planetScaleApiRequest.call(this, 'DELETE', endpoint);
        } catch (error) {
          // Ignore errors during cleanup
        }

        delete webhookData.webhookId;
        delete webhookData.webhookSecret;

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    emitLicensingNotice();

    const req = this.getRequestObject();
    const headers = this.getHeaderData() as IDataObject;
    const options = this.getNodeParameter('options', {}) as IDataObject;
    const webhookData = this.getWorkflowStaticData('node');
    const verifySignature = options.verifySignature !== false;

    // Verify signature if enabled
    if (verifySignature) {
      const signature = headers['x-planetscale-signature'] as string;
      const webhookSecret = webhookData.webhookSecret as string;

      if (!signature) {
        return {
          webhookResponse: {
            status: 401,
            body: JSON.stringify({ error: 'Missing signature header' }),
            headers: { 'Content-Type': 'application/json' },
          },
          workflowData: [],
        };
      }

      if (!webhookSecret) {
        return {
          webhookResponse: {
            status: 500,
            body: JSON.stringify({ error: 'Webhook secret not configured' }),
            headers: { 'Content-Type': 'application/json' },
          },
          workflowData: [],
        };
      }

      const rawBody =
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

      if (!isValid) {
        return {
          webhookResponse: {
            status: 401,
            body: JSON.stringify({ error: 'Invalid signature' }),
            headers: { 'Content-Type': 'application/json' },
          },
          workflowData: [],
        };
      }
    }

    const body = this.getBodyData() as IDataObject;

    // Filter by selected events
    const selectedEvents = this.getNodeParameter('events') as string[];
    const eventType = body.type as string;

    if (selectedEvents.length > 0 && !selectedEvents.includes(eventType)) {
      // Event not in the selected list, acknowledge but don't process
      return {
        webhookResponse: {
          status: 200,
          body: JSON.stringify({ received: true, processed: false }),
          headers: { 'Content-Type': 'application/json' },
        },
        workflowData: [],
      };
    }

    return {
      workflowData: [this.helpers.returnJsonArray(body)],
    };
  }
}
