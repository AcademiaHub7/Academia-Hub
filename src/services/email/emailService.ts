/**
 * Service d'envoi d'emails
 * @module services/email/emailService
 */

/**
 * Interface pour les options d'email
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, unknown>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

/**
 * Service pour l'envoi d'emails
 */
export class EmailService {
  /**
   * Constructeur du service d'email
   */
  constructor() {
    // Aucune initialisation nécessaire pour le moment
  }
  
  /**
   * Obtient l'adresse d'expéditeur pour les emails
   * @returns L'adresse email d'expéditeur
   */
  private getSender(): string {
    return process.env.EMAIL_SENDER || 'noreply@academiahub.com';
  }
  
  /**
   * Envoie un email
   * @param options Options de l'email
   * @returns Promise indiquant si l'envoi a réussi
   */
  public async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const sender = this.getSender();
      console.log(`[EMAIL] Envoi d'un email de ${sender} à ${options.to}`);
      console.log(`[EMAIL] Sujet: ${options.subject}`);
      console.log(`[EMAIL] Contenu: ${options.text || options.html}`);
      
      // Simulation d'envoi d'email (à remplacer par une vraie implémentation)
      // Ici, on utiliserait un service d'email comme nodemailer avec le sender
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }
  
  /**
   * Envoie un email de confirmation d'inscription
   * @param to Adresse email du destinataire
   * @param name Nom du destinataire
   * @param schoolName Nom de l'école
   * @returns Promise indiquant si l'envoi a réussi
   */
  public async sendRegistrationConfirmation(to: string, name: string, schoolName: string): Promise<boolean> {
    const subject = `Bienvenue sur Academia Hub - Confirmation d'inscription`;
    const html = `
      <h1>Bienvenue sur Academia Hub, ${name}!</h1>
      <p>Votre école <strong>${schoolName}</strong> a été enregistrée avec succès.</p>
      <p>Vous pouvez maintenant vous connecter à votre tableau de bord pour commencer à configurer votre plateforme.</p>
      <p>Merci de nous avoir choisis!</p>
      <p>L'équipe Academia Hub</p>
    `;
    
    return this.sendEmail({
      to,
      subject,
      html
    });
  }
  
  /**
   * Envoie un email de confirmation de paiement
   * @param to Adresse email du destinataire
   * @param name Nom du destinataire
   * @param amount Montant du paiement
   * @param planName Nom du plan d'abonnement
   * @returns Promise indiquant si l'envoi a réussi
   */
  public async sendPaymentConfirmation(to: string, name: string, amount: number, planName: string): Promise<boolean> {
    const subject = `Academia Hub - Confirmation de paiement`;
    const html = `
      <h1>Confirmation de paiement</h1>
      <p>Bonjour ${name},</p>
      <p>Nous avons bien reçu votre paiement de <strong>${amount} FCFA</strong> pour le plan <strong>${planName}</strong>.</p>
      <p>Votre abonnement est maintenant actif.</p>
      <p>Merci pour votre confiance!</p>
      <p>L'équipe Academia Hub</p>
    `;
    
    return this.sendEmail({
      to,
      subject,
      html
    });
  }
}

// Exporter une instance singleton du service
export const emailService = new EmailService();

// Fonction d'aide pour la compatibilité avec le code existant
export const sendEmail = (options: EmailOptions): Promise<boolean> => {
  return emailService.sendEmail(options);
};

export default emailService;
