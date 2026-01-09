import { describe, it, expect } from 'vitest';
import {
  validateProfile,
  validateField,
  isProfileReadyForExport,
  safeGetProfileField,
} from '../profileValidation';
import type { ClaudeProfile } from '../../stores/profileStore';

// Helper to create a minimal valid profile
const createMinimalProfile = (): ClaudeProfile => ({
  id: 'test-id',
  name: 'Test Profile',
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
  role: 'Engineering',
  responsibilities: ['Code review', 'Technical planning'],
  enabledFeatures: ['code-generation', 'analysis'],
  connectedTools: [],
  escalationRules: [],
  securitySettings: {
    piiDetection: true,
    dataSensitivityLevel: 'medium',
    approvedDataSources: [],
    restrictedOperations: [],
  },
  baselinePrompt: '',
  customInstructions: '',
  securityLevel: 'balanced',
  customWorkflows: [],
});

describe('Profile Validation', () => {
  describe('validateProfile', () => {
    it('should pass validation for a complete profile', () => {
      const profile = createMinimalProfile();
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when role is missing', () => {
      const profile = createMinimalProfile();
      profile.role = null;
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'role',
          severity: 'error',
        })
      );
    });

    it('should fail validation when name is "New Profile"', () => {
      const profile = createMinimalProfile();
      profile.name = 'New Profile';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          severity: 'error',
        })
      );
    });

    it('should fail validation when responsibilities are empty', () => {
      const profile = createMinimalProfile();
      profile.responsibilities = [];
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'responsibilities',
          severity: 'error',
        })
      );
    });

    it('should fail validation when no features are enabled', () => {
      const profile = createMinimalProfile();
      profile.enabledFeatures = [];
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'enabledFeatures',
          severity: 'error',
        })
      );
    });

    it('should warn when baseline prompt is missing', () => {
      const profile = createMinimalProfile();
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: 'baselinePrompt',
          severity: 'warning',
        })
      );
    });

    it('should warn when no escalation rules are defined', () => {
      const profile = createMinimalProfile();
      const result = validateProfile(profile);

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: 'escalationRules',
          severity: 'warning',
        })
      );
    });

    it('should warn when PII detection is disabled', () => {
      const profile = createMinimalProfile();
      profile.securitySettings.piiDetection = false;
      const result = validateProfile(profile);

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          field: 'security',
          severity: 'warning',
        })
      );
    });

    it('should fail validation when profile name is too long', () => {
      const profile = createMinimalProfile();
      profile.name = 'a'.repeat(101);
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: expect.stringContaining('100 characters') as string,
        })
      );
    });
  });

  describe('validateField', () => {
    it('should return errors for a specific field', () => {
      const profile = createMinimalProfile();
      profile.role = null;

      const errors = validateField(profile, 'role');

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('role');
    });

    it('should return empty array when field is valid', () => {
      const profile = createMinimalProfile();
      const errors = validateField(profile, 'role');

      expect(errors).toHaveLength(0);
    });
  });

  describe('isProfileReadyForExport', () => {
    it('should return true for valid profile', () => {
      const profile = createMinimalProfile();
      expect(isProfileReadyForExport(profile)).toBe(true);
    });

    it('should return false for invalid profile', () => {
      const profile = createMinimalProfile();
      profile.role = null;
      expect(isProfileReadyForExport(profile)).toBe(false);
    });

    it('should return true even when there are warnings', () => {
      const profile = createMinimalProfile();
      // Profile is valid but will have warnings (no baseline prompt)
      expect(isProfileReadyForExport(profile)).toBe(true);
    });
  });

  describe('safeGetProfileField', () => {
    it('should return field value when profile exists', () => {
      const profile = createMinimalProfile();
      const name = safeGetProfileField(profile, 'name', 'default');
      expect(name).toBe('Test Profile');
    });

    it('should return fallback when profile is null', () => {
      const name = safeGetProfileField(null, 'name', 'default');
      expect(name).toBe('default');
    });

    it('should return fallback when profile is undefined', () => {
      const name = safeGetProfileField(undefined, 'name', 'default');
      expect(name).toBe('default');
    });

    it('should return field value even when it is falsy but not null/undefined', () => {
      const profile = createMinimalProfile();
      profile.baselinePrompt = '';
      const prompt = safeGetProfileField(profile, 'baselinePrompt', 'default');
      expect(prompt).toBe('');
    });
  });
});
