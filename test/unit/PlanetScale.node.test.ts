/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { PlanetScale } from '../../nodes/PlanetScale/PlanetScale.node';
import { PlanetScaleTrigger } from '../../nodes/PlanetScale/PlanetScaleTrigger.node';

describe('PlanetScale Node', () => {
  let node: PlanetScale;

  beforeEach(() => {
    node = new PlanetScale();
  });

  describe('Node Description', () => {
    it('should have correct name', () => {
      expect(node.description.name).toBe('planetScale');
    });

    it('should have correct display name', () => {
      expect(node.description.displayName).toBe('PlanetScale');
    });

    it('should have correct icon reference', () => {
      expect(node.description.icon).toBe('file:planetscale.svg');
    });

    it('should have correct credentials', () => {
      expect(node.description.credentials).toEqual([
        {
          name: 'planetScaleApi',
          required: true,
        },
      ]);
    });

    it('should have all 12 resources', () => {
      const resourceProperty = node.description.properties.find(
        (p) => p.name === 'resource',
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty?.type).toBe('options');
      expect((resourceProperty as any).options).toHaveLength(12);
    });

    it('should have correct resource values', () => {
      const resourceProperty = node.description.properties.find(
        (p) => p.name === 'resource',
      );
      const options = (resourceProperty as any).options;
      const values = options.map((o: any) => o.value);

      expect(values).toContain('organization');
      expect(values).toContain('database');
      expect(values).toContain('branch');
      expect(values).toContain('deployRequest');
      expect(values).toContain('password');
      expect(values).toContain('backup');
      expect(values).toContain('deployQueue');
      expect(values).toContain('serviceToken');
      expect(values).toContain('webhook');
      expect(values).toContain('organizationMember');
      expect(values).toContain('region');
      expect(values).toContain('user');
    });
  });
});

describe('PlanetScale Trigger Node', () => {
  let triggerNode: PlanetScaleTrigger;

  beforeEach(() => {
    triggerNode = new PlanetScaleTrigger();
  });

  describe('Trigger Node Description', () => {
    it('should have correct name', () => {
      expect(triggerNode.description.name).toBe('planetScaleTrigger');
    });

    it('should have correct display name', () => {
      expect(triggerNode.description.displayName).toBe('PlanetScale Trigger');
    });

    it('should have correct group', () => {
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have no inputs', () => {
      expect(triggerNode.description.inputs).toEqual([]);
    });

    it('should have one output', () => {
      expect(triggerNode.description.outputs).toEqual(['main']);
    });

    it('should have webhook configuration', () => {
      expect(triggerNode.description.webhooks).toBeDefined();
      expect(triggerNode.description.webhooks).toHaveLength(1);
      expect(triggerNode.description.webhooks![0].httpMethod).toBe('POST');
    });

    it('should have required parameters', () => {
      const properties = triggerNode.description.properties;
      const orgParam = properties.find((p) => p.name === 'organizationName');
      const dbParam = properties.find((p) => p.name === 'databaseName');
      const eventsParam = properties.find((p) => p.name === 'events');

      expect(orgParam?.required).toBe(true);
      expect(dbParam?.required).toBe(true);
      expect(eventsParam?.required).toBe(true);
    });

    it('should have all event types', () => {
      const eventsProperty = triggerNode.description.properties.find(
        (p) => p.name === 'events',
      );
      expect(eventsProperty?.type).toBe('multiOptions');
      expect((eventsProperty as any).options.length).toBeGreaterThanOrEqual(11);
    });
  });

  describe('Webhook Methods', () => {
    it('should have webhook methods defined', () => {
      expect(triggerNode.webhookMethods).toBeDefined();
      expect(triggerNode.webhookMethods.default).toBeDefined();
      expect(triggerNode.webhookMethods.default.checkExists).toBeDefined();
      expect(triggerNode.webhookMethods.default.create).toBeDefined();
      expect(triggerNode.webhookMethods.default.delete).toBeDefined();
    });
  });
});
