import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey || 'mock-key-for-now');

export class AIService {
  /**
   * Génère une réponse intelligente de l'assistant pour le client WhatsApp
   */
  async generateResponse(
    userMessage: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    pmeContext: {
      name: string;
      description?: string;
      tone?: string;
      welcomeMessage?: string;
      deliveryInfo?: string;
      catalogue: Array<{ name: string; price: number; category?: string; description?: string }>;
    }
  ): Promise<string> {
    if (!config.geminiApiKey || config.geminiApiKey.includes('mock-key') || config.geminiApiKey.includes('your-key')) {
      const firstProd = pmeContext.catalogue[0]?.name || 'nos articles';
      const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
      const appUrl = process.env.FRONTEND_URL || 'https://reflex-dashboard-lfp6.onrender.com';
      return `Bonjour ! Bienvenue chez ${pmeContext.name}.\n\n` +
        `Nous avons actuellement *${firstProd}* à ${pmeContext.catalogue[0]?.price?.toLocaleString() || '45 000'} FCFA.\n\n` +
        `*Lien de règlement Mobile Money sécurisé (MTN / Moov / Wave / Carte)* :\n` +
        `${appUrl}/#payment-checkout?orderId=${orderId}`;
    }

    try {
      const appUrl = process.env.FRONTEND_URL || 'https://reflex-dashboard-lfp6.onrender.com';
      const systemPrompt = `Tu es Reflex, l'assistant commercial IA autonome de la PME "${pmeContext.name}" au Bénin / Afrique de l'Ouest.
Description de l'entreprise : ${pmeContext.description || 'Commerce général'}
Ton de communication imposé : ${pmeContext.tone || 'Chaleureux & Commercial'}
Message de bienvenue type : ${pmeContext.welcomeMessage || 'Bonjour !'}
Politique de livraison / FAQ : ${pmeContext.deliveryInfo || 'Livraison à Cotonou et environs'}

Catalogue des produits disponibles :
${JSON.stringify(pmeContext.catalogue, null, 2)}

Consignes de vente cruciales :
1. Comporte-toi EXACTEMENT comme un assistant humain (un vendeur courtois, naturel et chaleureux). Salue toujours le client s'il s'agit du premier message.
2. Pose des questions pour comprendre le besoin du client et engage une discussion normale. Ne sois pas un robot expéditif.
3. Ne donne pas le lien de paiement tout de suite. Attends que vous ayez trouvé un accord, que le client ait choisi son produit, et qu'il dise explicitement qu'il veut payer ou passer commande.
4. LORSQUE le client est prêt à payer, génère le lien de paiement sous ce format exact :
   "*Voici votre lien de règlement Mobile Money sécurisé* : ${appUrl}/#payment-checkout?orderId=ORD-229-XXX" (remplace XXX par 3 chiffres aléatoires).
5. Précise que le paiement est sécurisé via MTN, Moov, ou Wave avec reçu instantané.
6. N'utilise aucun emoji ni sticker dans les messages.
7. Garde des réponses synthétiques, très naturelles, adaptées à une messagerie comme WhatsApp.`;

      // Use Gemini 1.5 Flash
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt
      });

      // Format chat history for Gemini API
      // Gemini uses 'user' and 'model' as roles
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      return text || `Bonjour ! Merci d'avoir contacté ${pmeContext.name}. Comment puis-je vous aider ?`;
    } catch (error: any) {
      console.error('Erreur Gemini LLM:', error.message);
      const firstProd = pmeContext.catalogue[0]?.name || 'nos articles';
      const firstPrice = pmeContext.catalogue[0]?.price?.toLocaleString() || '35 000';
      const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
      const appUrl = process.env.FRONTEND_URL || 'https://reflex-dashboard-lfp6.onrender.com';
      return `Bonjour et bienvenue chez *${pmeContext.name}* !\n\n` +
        `Nous proposons *${firstProd}* à ${firstPrice} FCFA.\n\n` +
        `*Lien de règlement Mobile Money (MTN / Moov / Wave / Carte)* :\n` +
        `${appUrl}/#payment-checkout?orderId=${orderId}`;
    }
  }
}

export const aiService = new AIService();
