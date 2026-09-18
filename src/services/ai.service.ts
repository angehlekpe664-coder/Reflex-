import OpenAI from 'openai';
import { config } from '../config/env.js';

const openai = new OpenAI({
  apiKey: config.openaiApiKey || 'mock-key-for-now',
});

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
    if (!config.openaiApiKey || !config.openaiApiKey.startsWith('sk-') || config.openaiApiKey.includes('your-key-here') || config.openaiApiKey.includes('mock-key')) {
      const firstProd = pmeContext.catalogue[0]?.name || 'nos articles';
      const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
      const appUrl = process.env.FRONTEND_URL || 'https://reflex-dashboard-lfp6.onrender.com';
      return `Bonjour ! Bienvenue chez ${pmeContext.name}. 😊\n\n` +
        `Nous avons actuellement *${firstProd}* à ${pmeContext.catalogue[0]?.price.toLocaleString() || '45 000'} FCFA.\n\n` +
        `💳 *Lien de règlement Mobile Money sécurisé (MTN / Moov / Wave)* :\n` +
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
1. Adopte rigoureusement le ton imposé (${pmeContext.tone || 'Chaleureux'}).
2. Réponds précisément aux questions sur les produits, les prix (en FCFA / XOF) et la livraison.
3. Dès que le client est d'accord pour acheter ou demande comment payer, génère IMMÉDIATEMENT un lien de paiement sous ce format exact :
   "💳 *Lien de règlement Mobile Money sécurisé* : ${appUrl}/#payment-checkout?orderId=ORD-229-XXX" (remplace XXX par 3 chiffres aléatoires).
4. Précise que le paiement est sécurisé et disponible via MTN Mobile Money, Moov Money et Wave avec reçu instantané.
5. Garde des réponses synthétiques adaptées à WhatsApp.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 350,
      });

      return response.choices[0]?.message?.content || `Bonjour ! Merci d'avoir contacté ${pmeContext.name}. Comment puis-je vous aider ?`;
    } catch (error: any) {
      console.error('Erreur OpenAI LLM:', error.message);
      const firstProd = pmeContext.catalogue[0]?.name || 'nos articles';
      const firstPrice = pmeContext.catalogue[0]?.price?.toLocaleString() || '35 000';
      const orderId = `ORD-229-${Math.floor(100 + Math.random() * 900)}`;
      const appUrl = process.env.FRONTEND_URL || 'https://reflex-dashboard-lfp6.onrender.com';
      return `Bonjour et bienvenue chez *${pmeContext.name}* ! 😊\n\n` +
        `Nous proposons *${firstProd}* à ${firstPrice} FCFA.\n\n` +
        `💳 *Lien de règlement Mobile Money (MTN / Moov / Wave)* :\n` +
        `${appUrl}/#payment-checkout?orderId=${orderId}`;
    }
  }
}

export const aiService = new AIService();
