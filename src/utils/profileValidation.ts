import { ClaudeProfile } from '../stores/profileStore';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validates a Claude profile and returns detailed validation results
 * @param profile - The profile to validate
 * @returns ValidationResult with any errors or warnings
 */
export function validateProfile(profile: ClaudeProfile): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required field validations
  if (!profile.role) {
    errors.push({
      field: 'role',
      message: 'Role must be selected. Please choose a role that best describes your use case.',
      severity: 'error',
    });
  }

  if (!profile.name || profile.name === 'New Profile' || profile.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message:
        'Profile must have a unique name. Choose a descriptive name for easy identification.',
      severity: 'error',
    });
  }

  if (profile.name && profile.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Profile name must be 100 characters or less.',
      severity: 'error',
    });
  }

  if (profile.responsibilities.length === 0) {
    errors.push({
      field: 'responsibilities',
      message:
        'At least one responsibility must be defined. Add key responsibilities for this profile.',
      severity: 'error',
    });
  }

  if (profile.enabledFeatures.length === 0) {
    errors.push({
      field: 'enabledFeatures',
      message: 'At least one feature must be enabled. Select features this profile will use.',
      severity: 'error',
    });
  }

  // Recommended field validations (warnings)
  if (profile.baselinePrompt.trim().length === 0) {
    warnings.push({
      field: 'baselinePrompt',
      message: "Consider adding a baseline prompt to better define the profile's behavior.",
      severity: 'warning',
    });
  }

  if (profile.baselinePrompt.length > 5000) {
    warnings.push({
      field: 'baselinePrompt',
      message: 'Baseline prompt is quite long. Consider keeping it concise for better performance.',
      severity: 'warning',
    });
  }

  if (profile.escalationRules.length === 0) {
    warnings.push({
      field: 'escalationRules',
      message: 'No escalation rules defined. Consider adding rules for governance and oversight.',
      severity: 'warning',
    });
  }

  if (profile.connectedTools.length === 0 || !profile.connectedTools.some((t) => t.connected)) {
    warnings.push({
      field: 'connectedTools',
      message: 'No tools are connected. Consider integrating tools to enhance capabilities.',
      severity: 'warning',
    });
  }

  // Security validations
  if (profile.securityLevel === 'permissive' && profile.escalationRules.length === 0) {
    warnings.push({
      field: 'security',
      message:
        'Permissive security level without escalation rules may pose risks. Consider adding oversight.',
      severity: 'warning',
    });
  }

  if (profile.securitySettings.piiDetection === false) {
    warnings.push({
      field: 'security',
      message: 'PII detection is disabled. Ensure this is intentional for your use case.',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a specific field and returns relevant errors
 * @param profile - The profile to validate
 * @param fieldName - The specific field to validate
 * @returns Array of validation errors for the field
 */
export function validateField(
  profile: ClaudeProfile,
  fieldName: keyof ClaudeProfile
): ValidationError[] {
  const result = validateProfile(profile);
  return [...result.errors, ...result.warnings].filter((error) => error.field === fieldName);
}

/**
 * Checks if profile is ready for export
 * @param profile - The profile to check
 * @returns true if profile can be safely exported
 */
export function isProfileReadyForExport(profile: ClaudeProfile): boolean {
  const result = validateProfile(profile);
  // Allow export if there are only warnings, not errors
  return result.errors.length === 0;
}

/**
 * Safely gets a profile field value with fallback
 * @param profile - The profile object
 * @param field - The field to access
 * @param fallback - Fallback value if field is null/undefined
 * @returns The field value or fallback
 */
export function safeGetProfileField<T>(
  profile: ClaudeProfile | null | undefined,
  field: keyof ClaudeProfile,
  fallback: T
): T {
  if (!profile) return fallback;
  const value = profile[field];
  return value !== null && value !== undefined ? (value as unknown as T) : fallback;
}
