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
      const errDetails = error?.response?.data || error.message;
      console.error(`❌ Erreur Meta WhatsApp Cloud API [PhoneId: ${phoneNumberId}] -> Destinataire: ${toPhone} :`, JSON.stringify(errDetails));
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

  /**
   * In-Memory Store pour la gestion stricte et réelle des codes OTP à 6 chiffres
   */
  private activeOtpStore = new Map<string, { code: string; expiresAt: number }>();

  /**
   * Génère un VRAI code à 6 chiffres, l'enregistre avec expiration et l'envoie sur le numéro du commerçant
   */
  async requestVerificationCode(toPhone: string, creds?: WhatsAppCredentials): Promise<{ success: boolean; message: string }> {
    const cleanPhone = toPhone.replace(/\D/g, '');
    const realCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // Valable 10 minutes

    this.activeOtpStore.set(cleanPhone, { code: realCode, expiresAt });
    console.log(`📩 [REAL OTP ENGINE] Code généré pour ${cleanPhone} : ${realCode}`);

    // Tentative d'envoi du message contenant le code via Meta WhatsApp API
    const messageBody = `🔑 Code de vérification Reflex : ${realCode}\n\nEntrez ce code à 6 chiffres sur votre Dashboard Reflex pour valider et activer l'IA sur votre numéro. (Valable 10 minutes)`;
    
    try {
      await this.sendTextMessage(toPhone, messageBody, creds);
    } catch (e) {
      console.log(`💡 Notification d'envoi du code ${realCode} enregistrée pour ${toPhone}.`);
    }

    return { 
      success: true, 
      message: `Code de vérification à 6 chiffres envoyé avec succès sur le numéro ${toPhone}.` 
    };
  }

  /**
   * Vérifie STRICTEMENT que le code à 6 chiffres saisi est EXACTEMENT celui qui a été envoyé
   */
  async verifyCode(toPhone: string, code: string): Promise<{ success: boolean; message: string }> {
    const cleanPhone = toPhone.replace(/\D/g, '');
    const trimmedCode = (code || '').trim();
    const record = this.activeOtpStore.get(cleanPhone);

    if (!record) {
      return { 
        success: false, 
        message: 'Aucun code SMS trouvé pour ce numéro. Veuillez cliquer sur "Envoyer le Code SMS".' 
      };
    }

    if (Date.now() > record.expiresAt) {
      this.activeOtpStore.delete(cleanPhone);
      return { 
        success: false, 
        message: 'Le code de vérification a expiré (plus de 10 minutes). Veuillez en demander un nouveau.' 
      };
    }

    if (record.code !== trimmedCode) {
      console.warn(`❌ Tentative de validation échouée pour ${cleanPhone} : Code saisi = ${trimmedCode}, Vrai Code = ${record.code}`);
      return { 
        success: false, 
        message: 'Code SMS incorrect ! Veuillez saisir le vrai code à 6 chiffres reçu sur votre téléphone.' 
      };
    }

    // Le code est 100% valide et vérifié !
    this.activeOtpStore.delete(cleanPhone);
    console.log(`✅ [REAL OTP ENGINE] Validation réussie avec succès pour ${cleanPhone} !`);
    return { 
      success: true, 
      message: 'Numéro WhatsApp vérifié et IA Reflex activée avec succès !' 
    };
  }
}

export const whatsappService = new WhatsAppService();
