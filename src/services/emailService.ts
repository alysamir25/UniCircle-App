// Simulated email service for event registrations
// In a real app, this would connect to SendGrid, AWS SES, etc.

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
}

class EmailService {
  private simulatedEmails: EmailOptions[] = [];
  
  // Simulate sending an email
  async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log('📧 [SIMULATED EMAIL SENT]:', options);
    
    // Store for demo purposes
    this.simulatedEmails.push({
      ...options,
      body: options.body + '\n\n---\n(This is a simulation. In production, this would be a real email.)'
    });
    
    // Show alert in browser for demo
    if (typeof window !== 'undefined') {
      alert(`📧 Email sent to ${options.to}\nSubject: ${options.subject}`);
    }
    
    return true;
  }
  
  // Get all sent emails (for demo display)
  getSentEmails(): EmailOptions[] {
    return this.simulatedEmails;
  }
  
  // Clear sent emails
  clearSentEmails(): void {
    this.simulatedEmails = [];
  }
  
  // ========== SPECIFIC EMAIL TEMPLATES ==========
  
  async sendRegistrationConfirmation(
    userEmail: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    isWaitlist: boolean = false
  ): Promise<boolean> {
    const subject = isWaitlist 
      ? `You're on the waitlist for: ${eventTitle}`
      : `Registration Confirmed: ${eventTitle}`;
    
    const body = isWaitlist 
      ? `Hello,\n\nYou have been added to the waitlist for "${eventTitle}".\n\nEvent Details:\n- Date: ${eventDate}\n- Location: ${eventLocation}\n\nWe will notify you if a spot becomes available.\n\nBest regards,\nSolent Computing Society`
      : `Hello,\n\nYour registration for "${eventTitle}" has been confirmed!\n\nEvent Details:\n- Date: ${eventDate}\n- Location: ${eventLocation}\n\nPlease arrive 10 minutes early. Bring your student ID.\n\nBest regards,\nSolent Computing Society`;
    
    return this.sendEmail({
      to: userEmail,
      subject,
      body,
      eventTitle,
      eventDate,
      eventLocation
    });
  }
  
  async sendRegistrationCancellation(
    userEmail: string,
    eventTitle: string,
    eventDate: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: `Registration Cancelled: ${eventTitle}`,
      body: `Hello,\n\nYour registration for "${eventTitle}" (${eventDate}) has been cancelled.\n\nIf this was a mistake, you can re-register if spots are still available.\n\nBest regards,\nSolent Computing Society`,
      eventTitle,
      eventDate
    });
  }
  
  async sendWaitlistPromotion(
    userEmail: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: `🎉 Spot Available: ${eventTitle}`,
      body: `Great news!\n\nA spot has opened up for "${eventTitle}".\n\nEvent Details:\n- Date: ${eventDate}\n- Location: ${eventLocation}\n\nYou have 24 hours to confirm your attendance. Please visit the events page to secure your spot.\n\nBest regards,\nSolent Computing Society`,
      eventTitle,
      eventDate,
      eventLocation
    });
  }
  
  async sendEventReminder(
    userEmail: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    daysUntil: number
  ): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      subject: `Reminder: ${eventTitle} in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
      body: `Friendly reminder about your upcoming event!\n\nEvent: ${eventTitle}\nDate: ${eventDate}\nLocation: ${eventLocation}\n\nPlease remember to bring any required materials.\n\nBest regards,\nSolent Computing Society`,
      eventTitle,
      eventDate,
      eventLocation
    });
  }
}

// Create a singleton instance
const emailService = new EmailService();
export default emailService;