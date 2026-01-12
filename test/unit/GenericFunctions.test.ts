/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  validateOrganizationName,
  validateDatabaseName,
  validateBranchName,
  buildEndpoint,
  cleanObject,
} from '../../nodes/PlanetScale/GenericFunctions';

describe('GenericFunctions', () => {
  describe('validateOrganizationName', () => {
    it('should trim whitespace and convert to lowercase', () => {
      expect(validateOrganizationName('  MyOrg  ')).toBe('myorg');
    });

    it('should handle already lowercase names', () => {
      expect(validateOrganizationName('myorg')).toBe('myorg');
    });

    it('should convert mixed case to lowercase', () => {
      expect(validateOrganizationName('MyOrganization')).toBe('myorganization');
    });
  });

  describe('validateDatabaseName', () => {
    it('should trim whitespace and convert to lowercase', () => {
      expect(validateDatabaseName('  MyDatabase  ')).toBe('mydatabase');
    });

    it('should handle names with hyphens', () => {
      expect(validateDatabaseName('my-database')).toBe('my-database');
    });

    it('should convert mixed case to lowercase', () => {
      expect(validateDatabaseName('MyDB')).toBe('mydb');
    });
  });

  describe('validateBranchName', () => {
    it('should trim whitespace and convert to lowercase', () => {
      expect(validateBranchName('  Feature-Branch  ')).toBe('feature-branch');
    });

    it('should preserve hyphens and underscores', () => {
      expect(validateBranchName('feature_branch-name')).toBe('feature_branch-name');
    });
  });

  describe('buildEndpoint', () => {
    it('should build a proper endpoint path', () => {
      expect(buildEndpoint(['organizations', 'myorg', 'databases'])).toBe(
        '/organizations/myorg/databases',
      );
    });

    it('should handle single segment', () => {
      expect(buildEndpoint(['regions'])).toBe('/regions');
    });

    it('should handle multiple segments', () => {
      expect(
        buildEndpoint([
          'organizations',
          'myorg',
          'databases',
          'mydb',
          'branches',
          'main',
        ]),
      ).toBe('/organizations/myorg/databases/mydb/branches/main');
    });
  });

  describe('cleanObject', () => {
    it('should remove undefined values', () => {
      const obj = { a: 1, b: undefined, c: 'test' };
      expect(cleanObject(obj)).toEqual({ a: 1, c: 'test' });
    });

    it('should remove null values', () => {
      const obj = { a: 1, b: null, c: 'test' };
      expect(cleanObject(obj)).toEqual({ a: 1, c: 'test' });
    });

    it('should remove empty strings', () => {
      const obj = { a: 1, b: '', c: 'test' };
      expect(cleanObject(obj)).toEqual({ a: 1, c: 'test' });
    });

    it('should keep zero values', () => {
      const obj = { a: 0, b: false, c: 'test' };
      expect(cleanObject(obj)).toEqual({ a: 0, b: false, c: 'test' });
    });

    it('should handle empty object', () => {
      expect(cleanObject({})).toEqual({});
    });

    it('should handle nested objects by keeping them', () => {
      const obj = { a: 1, nested: { x: 1 } };
      expect(cleanObject(obj)).toEqual({ a: 1, nested: { x: 1 } });
    });
  });
});
