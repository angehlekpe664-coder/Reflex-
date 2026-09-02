import axios from 'axios';
import { config } from '../config/env.js';

export interface WhatsAppCredentials {
  phoneNumberId?: string;
  token?: string;
}

export class WhatsAppService {
  /**
   * Envoie un message texte simple sur WhatsApp avec support des crédentiels dynamiques PME
   */
  async sendTextMessage(toPhone: string, textContent: string, creds?: WhatsAppCredentials): Promise<void> {
    const phoneNumberId = creds?.phoneNumberId || config.whatsapp.phoneNumberId;
    const token = creds?.token || config.whatsapp.token;
    const apiUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    try {
      await axios.post(
        apiUrl,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: toPhone,
          type: 'text',
          text: { preview_url: true, body: textContent },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`📤 Message WhatsApp envoyé à ${toPhone} via le sous-compte ${phoneNumberId}`);
    } catch (error: any) {
      console.error('Erreur lors de l’envoi du message WhatsApp:', error?.response?.data || error.message);
    }
  }

  /**
   * Envoie un message avec des boutons interactifs (ex: Réserver / Payer)
   */
  async sendInteractiveButtons(
    toPhone: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>,
    creds?: WhatsAppCredentials
  ): Promise<void> {
    const phoneNumberId = creds?.phoneNumberId || config.whatsapp.phoneNumberId;
    const token = creds?.token || config.whatsapp.token;
    const apiUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

    try {
      await axios.post(
        apiUrl,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: toPhone,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
              buttons: buttons.map(b => ({
                type: 'reply',
                reply: { id: b.id, title: b.title.substring(0, 20) }
              }))
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Erreur bouton interactif WhatsApp:', error?.response?.data || error.message);
    }
  }
}

export const whatsappService = new WhatsAppService();
