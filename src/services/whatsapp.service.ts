import axios from 'axios';
import { config } from '../config/env.js';

export class WhatsAppService {
  private apiUrl = `https://graph.facebook.com/v20.0/${config.whatsapp.phoneNumberId}/messages`;

  /**
   * Envoie un message texte simple sur WhatsApp
   */
  async sendTextMessage(toPhone: string, textContent: string): Promise<void> {
    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: toPhone,
          type: 'text',
          text: { preview_url: true, body: textContent },
        },
        {
          headers: {
            Authorization: `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Erreur lors de l’envoi du message WhatsApp:', error?.response?.data || error.message);
    }
  }

  /**
   * Envoie un message avec des boutons interactifs (ex: Réserver / Payer)
   */
  async sendInteractiveButtons(toPhone: string, bodyText: string, buttons: Array<{ id: string; title: string }>): Promise<void> {
    try {
      await axios.post(
        this.apiUrl,
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
            Authorization: `Bearer ${config.whatsapp.token}`,
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
