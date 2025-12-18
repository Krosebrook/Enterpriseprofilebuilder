/**
 * @fileoverview Monitoring and alerting utilities
 * @module lib/monitoring
 */

import { logger } from './logger';

/**
 * Security event types for monitoring
 */
export enum SecurityEventType {
  PROMPT_INJECTION_DETECTED = 'PROMPT_INJECTION_DETECTED',
  PROMPT_INJECTION_BLOCKED = 'PROMPT_INJECTION_BLOCKED',
  OUTPUT_VIOLATION_DETECTED = 'OUTPUT_VIOLATION_DETECTED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  HITL_REVIEW_REQUESTED = 'HITL_REVIEW_REQUESTED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

/**
 * Security event metadata
 */
export interface SecurityEventMetadata {
  userId?: string;
  sessionId?: string;
  riskLevel?: string;
  patterns?: string[];
  confidence?: number;
  violations?: string[];
  ipAddress?: string;
  userAgent?: string;
  [key: string]: unknown;
}

/**
 * Notification channel types
 */
export enum NotificationChannel {
  EMAIL = 'email',
  SLACK = 'slack',
  PAGERDUTY = 'pagerduty',
  WEBHOOK = 'webhook',
}

/**
 * Security notification service
 */
export class SecurityNotificationService {
  private emailRecipients: string[] = [];
  private slackWebhookUrl?: string;
  private pagerDutyApiKey?: string;

  constructor() {
    // Load configuration from environment (Vite uses import.meta.env in browser)
    const emailList = import.meta.env.VITE_SECURITY_EMAIL_RECIPIENTS as string | undefined;
    if (emailList) {
      this.emailRecipients = emailList.split(',').map(e => e.trim());
    }
    
    this.slackWebhookUrl = import.meta.env.VITE_SLACK_SECURITY_WEBHOOK as string | undefined;
    this.pagerDutyApiKey = import.meta.env.VITE_PAGERDUTY_API_KEY as string | undefined;
  }

  /**
   * Send security notification to configured channels
   */
  async notifySecurityTeam(
    eventType: SecurityEventType,
    metadata: SecurityEventMetadata,
    channels: NotificationChannel[] = [NotificationChannel.EMAIL, NotificationChannel.SLACK]
  ): Promise<void> {
    try {
      const message = this.formatSecurityMessage(eventType, metadata);

      // Send to each configured channel
      for (const channel of channels) {
        switch (channel) {
          case NotificationChannel.EMAIL:
            await this.sendEmail(message, metadata);
            break;
          case NotificationChannel.SLACK:
            await this.sendSlack(message, metadata);
            break;
          case NotificationChannel.PAGERDUTY:
            await this.sendPagerDuty(message, metadata);
            break;
          case NotificationChannel.WEBHOOK:
            await this.sendWebhook(message, metadata);
            break;
        }
      }

      logger.info('Security notification sent', {
        eventType,
        channels,
        userId: metadata.userId,
      });
    } catch (error) {
      logger.error('Failed to send security notification', error as Error, {
        eventType,
        metadata,
      });
    }
  }

  /**
   * Format security event message
   */
  private formatSecurityMessage(
    eventType: SecurityEventType,
    metadata: SecurityEventMetadata
  ): string {
    const timestamp = new Date().toISOString();
    const severity = this.getSeverity(eventType);

    return `
🚨 Security Alert: ${eventType}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Severity: ${severity}
Time: ${timestamp}
${metadata.userId ? `User: ${metadata.userId}` : ''}
${metadata.riskLevel ? `Risk Level: ${metadata.riskLevel}` : ''}
${metadata.patterns ? `Patterns Detected: ${metadata.patterns.join(', ')}` : ''}
${metadata.confidence ? `Confidence: ${(metadata.confidence * 100).toFixed(1)}%` : ''}
${metadata.violations ? `Violations: ${metadata.violations.join(', ')}` : ''}

Action Required: Review the security dashboard for details.
    `.trim();
  }

  /**
   * Get severity level for event type
   */
  private getSeverity(eventType: SecurityEventType): string {
    const severityMap: Record<SecurityEventType, string> = {
      [SecurityEventType.PROMPT_INJECTION_DETECTED]: 'HIGH',
      [SecurityEventType.PROMPT_INJECTION_BLOCKED]: 'CRITICAL',
      [SecurityEventType.OUTPUT_VIOLATION_DETECTED]: 'MEDIUM',
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: 'LOW',
      [SecurityEventType.HITL_REVIEW_REQUESTED]: 'MEDIUM',
      [SecurityEventType.UNAUTHORIZED_ACCESS]: 'HIGH',
      [SecurityEventType.SUSPICIOUS_ACTIVITY]: 'MEDIUM',
    };

    return severityMap[eventType] || 'UNKNOWN';
  }

  /**
   * Send email notification
   */
  private async sendEmail(message: string, metadata: SecurityEventMetadata): Promise<void> {
    if (this.emailRecipients.length === 0) {
      logger.debug('Email notification skipped: No recipients configured');
      return;
    }

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    logger.info('Email notification would be sent', {
      recipients: this.emailRecipients,
      subject: `Security Alert: ${metadata.riskLevel || 'Unknown'}`,
    });

    // TODO (Q1 2026): Implement email service integration
    // Recommended: SendGrid, AWS SES, or Mailgun
    // Example with SendGrid:
    // import sgMail from '@sendgrid/mail'
    // sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY)
    // await sgMail.send({
    //   to: this.emailRecipients,
    //   from: 'security@enterpriseprofilebuilder.com',
    //   subject: `Security Alert: ${metadata.riskLevel || 'Unknown'}`,
    //   text: message,
    //   html: formatAsHtml(message)
    // })
  }

  /**
   * Send Slack notification
   */
  private async sendSlack(message: string, metadata: SecurityEventMetadata): Promise<void> {
    if (!this.slackWebhookUrl) {
      logger.debug('Slack notification skipped: No webhook configured');
      return;
    }

    try {
      const response = await fetch(this.slackWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: message,
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
      }
    } catch (error) {
      logger.error('Failed to send Slack notification', error as Error);
    }
  }

  /**
   * Send PagerDuty notification
   */
  private async sendPagerDuty(message: string, metadata: SecurityEventMetadata): Promise<void> {
    if (!this.pagerDutyApiKey) {
      logger.debug('PagerDuty notification skipped: No API key configured');
      return;
    }

    // TODO (Q1 2026): Implement PagerDuty Events API v2 integration
    // Documentation: https://developer.pagerduty.com/docs/events-api-v2/overview/
    // Required fields:
    // - routing_key: Integration key from PagerDuty service
    // - event_action: "trigger" for new incidents
    // - payload: { summary, severity, source, custom_details }
    // Example:
    // await fetch('https://events.pagerduty.com/v2/enqueue', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     routing_key: this.pagerDutyApiKey,
    //     event_action: 'trigger',
    //     payload: {
    //       summary: message,
    //       severity: this.getSeverity(eventType).toLowerCase(),
    //       source: 'enterprise-profile-builder',
    //       custom_details: metadata
    //     }
    //   })
    // })
    logger.info('PagerDuty notification would be sent', { metadata });
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(message: string, metadata: SecurityEventMetadata): Promise<void> {
    const webhookUrl = import.meta.env.VITE_SECURITY_WEBHOOK_URL as string | undefined;
    
    if (!webhookUrl) {
      logger.debug('Webhook notification skipped: No URL configured');
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          metadata,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      logger.error('Failed to send webhook notification', error as Error);
    }
  }
}

/**
 * Export singleton instance
 */
export const securityNotifications = new SecurityNotificationService();

/**
 * Convenience function for sending security alerts
 */
export async function alertSecurityTeam(
  eventType: SecurityEventType,
  metadata: SecurityEventMetadata
): Promise<void> {
  await securityNotifications.notifySecurityTeam(eventType, metadata);
}
