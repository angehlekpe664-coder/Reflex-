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

    const secretKey = config.fedapay.secretKey;

    try {
      console.log(`💳 Initialisation transaction FedaPay (${config.fedapay.environment}) pour ${data.amount} FCFA...`);

      // 1. Créer la transaction FedaPay
      const response = await axios.post(
        `${baseUrl}/transactions`,
        {
          amount: Math.round(data.amount),
          currency: { iso: 'XOF' },
          description: data.description || `Commande Reflex ${data.orderId}`,
          callback_url: `https://reflex-dashboard-lfp6.onrender.com/#pay-${data.orderId}`,
          customer: {
            firstname: data.customerName || 'Client',
            phone_number: {
              number: data.customerPhone ? data.customerPhone.replace(/\s+/g, '') : '97000000',
              country: 'BJ' // Bénin par défaut
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'x-api-key': secretKey,
            'Content-Type': 'application/json',
          }
        }
      );

      const transaction = response.data.v1?.transaction || response.data.transaction || response.data.v1 || response.data;
      const transactionId = transaction?.id;

      if (!transactionId) {
        throw new Error('ID de transaction non retourné par FedaPay');
      }

      // 2. Générer le jeton et le lien de paiement direct FedaPay
      const tokenResponse = await axios.post(
        `${baseUrl}/transactions/${transactionId}/token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'x-api-key': secretKey,
            'Content-Type': 'application/json',
          }
        }
      );

      const tokenData = tokenResponse.data.token || tokenResponse.data.v1?.token || tokenResponse.data;
      const checkoutUrl = tokenData?.url || `https://pay.fedapay.com/${transactionId}`;

      console.log(`✅ Lien FedaPay Live généré : ${checkoutUrl}`);
      return checkoutUrl;
    } catch (error: any) {
      console.error('⚠️ Erreur création paiement FedaPay Live:', error?.response?.data || error.message);
      // Lien direct hébergé Reflex pour le client
      return `https://reflex-dashboard-lfp6.onrender.com/#pay-${data.orderId}`;
    }
  }
}

export const paymentService = new PaymentService();
