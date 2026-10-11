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

      // Calcul de l'heure locale au Bénin / Afrique de l'Ouest (UTC+1)
      const now = new Date();
      const beninTimeStr = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Porto-Novo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);
      const beninHour = parseInt(beninTimeStr.split(':')[0], 10);
      const isNight = beninHour >= 18 || beninHour < 5;
      const greetingWord = isNight ? 'Bonsoir' : 'Bonjour';

      const hasHistory = chatHistory && chatHistory.length > 0;

      const systemPrompt = `Tu es Reflex, l'assistant commercial humain de la boutique "${pmeContext.name}" au Bénin.
Description de l'activité : ${pmeContext.description || 'Commerce général de qualité'}
Ton : ${pmeContext.tone || 'Chaleureux, humain, naturel et vendeur'}
Politique de livraison / Infos : ${pmeContext.deliveryInfo || 'Livraison rapide à Cotonou, Calavi et environs'}

Catalogue des produits disponibles et prix :
${JSON.stringify(pmeContext.catalogue, null, 2)}

CONTEXTE TEMPOREL ET HEURE LOCALE :
Il est actuellement ${beninTimeStr} au Bénin (${isNight ? 'soirée / nuit' : 'journée'}).
La salutation appropriée est UNIQUEMENT : "${greetingWord}". Ne dis JAMAIS "${isNight ? 'Bonjour' : 'Bonsoir'}".

RÈGLES CONVERSATIONNELLES CAPITALES (STRICT RESPECT) :
1. GESTION DES SALUTATIONS (CRUCIAL) :
${hasHistory
  ? `- ATTENTION STRICTE : La conversation est DÉJÀ EN COURS (historique existant). IL EST STRICTEMENT INTERDIT de dire "${greetingWord}", "Bonjour", "Bonsoir" ou "Bienvenue chez ${pmeContext.name}". Réponds DIRECTEMENT et immédiatement à la question ou à la remarque du client, exactement comme un humain sur WhatsApp.`
  : `- C'est le tout premier message du client. Tu peux saluer poliment avec "${greetingWord} ! Bienvenue chez ${pmeContext.name}." puis enchaîner directement sur sa demande.`
}

2. VRAIE CONVERSATION HUMAINE :
- Parle comme une vraie personne physique au comptoir ou sur WhatsApp, pas comme un robot ou une FAQ.
- Ne répète JAMAIS le message d'accueil ou le nom de la boutique dans chaque message.
- Sois fluide, empathique, à l'écoute et pertinent.
- Réponses concises, naturelles et directes (style messagerie instantanée mobile).

3. COMMERCE & PROCESSUS DE VENTE :
- Écoute le besoin, renseigne sur les articles et les prix réels en FCFA issus du catalogue.
- Ne donne pas le lien de paiement immédiatement. Échange d'abord pour confirmer le choix du client.
- LORSQUE le client confirme son achat et veut payer :
  "*Voici votre lien de règlement Mobile Money sécurisé* : ${appUrl}/#payment-checkout?orderId=ORD-229-XXX" (remplace XXX par 3 chiffres aléatoires).
  Précise que le paiement est rapide et sécurisé via MTN Mobile Money, Moov Money, Wave ou Carte bancaire.

4. FORMATAGE :
- N'utilise AUCUN emoji ni sticker dans tes messages.`;

      // Use modern Gemini 2.5 Flash
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt
      });

      // Format chat history for Gemini API
      // Gemini uses 'user' and 'model' as roles
      const formattedHistory = (chatHistory || []).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      return text || (hasHistory
        ? "Que puis-je faire pour vous ?"
        : `${greetingWord} ! Bienvenue chez ${pmeContext.name}. Comment puis-je vous aider ?`);
    } catch (error: any) {
      console.error('Erreur Gemini LLM:', error.message);
      const beninHour = new Date().getUTCHours() + 1;
      const isNight = beninHour >= 18 || beninHour < 5;
      const greetingWord = isNight ? 'Bonsoir' : 'Bonjour';
      return chatHistory && chatHistory.length > 0
        ? "Je vous écoute, comment puis-je vous renseigner ?"
        : `${greetingWord} ! Bienvenue chez ${pmeContext.name}. Que recherchez-vous aujourd'hui ?`;
    }
  }
}

export const aiService = new AIService();
