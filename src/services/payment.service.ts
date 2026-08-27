import axios from 'axios';
import { config } from '../config/env.js';

export interface PaymentRequest {
  amount: number; // Montant en FCFA / XOF
  description: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
}

export class PaymentService {
  /**
   * Génère un lien de paiement FedaPay (Mobile Money MTN, Moov, Carte)
   */
  async createFedaPayLink(data: PaymentRequest): Promise<string> {
    const baseUrl = config.fedapay.environment === 'live'
      ? 'https://api.fedapay.com/v1'
      : 'https://sandbox-api.fedapay.com/v1';

    try {
      // 1. Créer la transaction FedaPay
      const response = await axios.post(
        `${baseUrl}/transactions`,
        {
          amount: data.amount,
          currency: { iso: 'XOF' },
          description: data.description,
          callback_url: 'https://votre-domaine.com/api/payments/webhook',
          customer: {
            firstname: data.customerName || 'Client',
            phone_number: {
              number: data.customerPhone,
              country: 'BJ' // Bénin par défaut
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${config.fedapay.secretKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const transactionId = response.data.v1?.transaction?.id;

      // 2. Générer le lien de paiement
      const tokenResponse = await axios.post(
        `${baseUrl}/transactions/${transactionId}/token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${config.fedapay.secretKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return tokenResponse.data.token?.url || `https://pay.fedapay.com/${transactionId}`;
    } catch (error: any) {
      console.error('Erreur de création de paiement FedaPay:', error?.response?.data || error.message);
      // Mode Fallback pour simulation de test
      return `https://pay.fedapay.com/demo-link-order-${data.orderId}`;
    }
  }
}

export const paymentService = new PaymentService();
