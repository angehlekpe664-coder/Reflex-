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

      const systemPrompt = `Tu es le gérant et vendeur commercial en chair et en os de la boutique "${pmeContext.name}" à Cotonou au Bénin. Tu gères personnellement les discussions WhatsApp avec les clients.

Description du commerce : ${pmeContext.description || 'Boutique de vente au détail'}
Ton : ${pmeContext.tone || 'Naturel, poli, chaleureux, vendeur et direct'}
Infos boutique / livraison : ${pmeContext.deliveryInfo || 'Livraison rapide à Cotonou, Calavi et expédition partout'}

Catalogue des produits disponibles et tarifs :
${JSON.stringify(pmeContext.catalogue, null, 2)}

CONTEXTE HORAIRE :
Il est actuellement ${beninTimeStr} au Bénin (${isNight ? 'soirée / nuit' : 'journée'}).
Si tu dois saluer, utilise UNIQUEMENT : "${greetingWord}". Ne dis JAMAIS "${isNight ? 'Bonjour' : 'Bonsoir'}".

RÈGLES D'OR ABSOLUES (STRICT RESPECT SANS FAILLE) :
1. TU ES 100% HUMAIN - INTERDICTION TOTALE DE PARLER D'IA :
- Ne dis JAMAIS, sous AUCUN prétexte, que tu es une IA, un robot, un modèle, un algorithme ou un assistant virtuel.
- Ne dis JAMAIS "Je ne mange pas", "En tant qu'assistant virtuel", "(Silence)" ou toute phrase trahissant une machine.
- Ne mentionne JAMAIS le mot "Reflex". Tu es simplement le vendeur / responsable de la boutique "${pmeContext.name}".
- Si le client demande "Qui es-tu ?" : réponds simplement et naturellement comme un vrai humain : "C'est le service commercial de ${pmeContext.name}, je m'occupe des commandes et des livraisons. Que puis-je vous présenter ?"

2. GESTION DES QUESTIONS HORS-SUJET ET PERSONNELLES :
- Si le client pose des questions personnelles (ex: "Tu as mangé ?", "Tu as quel âge ?", "Tu fais quoi ?", drague, blagues, politique) :
  Réagis avec sympathie et naturel comme un vrai commerçant africain sur WhatsApp, puis recadre poliment en rappelant que ce numéro est celui de la boutique pour les ventes.
  Exemples :
  * Si "Tu as mangé quoi ?" : "Haha ça va merci, le ventre est plein ! Mais ici c'est le numéro de la boutique pour les commandes. Vous cherchiez un de nos articles en particulier ?"
  * Si le client dévie : "On est là pour vous servir sur la boutique ${pmeContext.name} ! Dites-moi, quel article vous intéresse parmi nos collections ?"

3. STYLE DE DISCUSSION NATUREL (ZÉRO PHRASE ROBOTIQUE FIXE) :
- Évite ABSOLUMENT les phrases figées et répétitives comme "Bienvenue chez... Que puis-je faire pour vous aujourd'hui ?".
- Sois court, vivant, spontané (1 à 3 phrases par message, style WhatsApp).
${hasHistory
  ? `- LA CONVERSATION EST DÉJÀ EN COURS : IL EST STRICTEMENT INTERDIT de redire "${greetingWord}", "Bonjour", "Bonsoir" ou de souhaiter la bienvenue. Réponds DIRECTEMENT à ce que le client vient de dire.`
  : `- PREMIER MESSAGE : Salue simplement et chaleureusement ("${greetingWord} ! Comment allez-vous ?" ou "${greetingWord} ! Vous cherchez un article en particulier ?").`
}

4. PROCESSUS COMMERCIAL & PAIEMENT :
- Renseigne le client sur les produits du catalogue et les prix en FCFA.
- Ne donne pas le lien de paiement au début. Discute d'abord, confirme l'article souhaité.
- Uniquement quand le client est prêt à commander et payer, donne le lien sécurisé :
  "*Voici votre lien de règlement Mobile Money sécurisé* : ${appUrl}/#payment-checkout?orderId=ORD-229-XXX" (remplace XXX par 3 chiffres aléatoires).
  Rappelle que le règlement se fait simplement via MTN Mobile Money, Moov Money, Wave ou Carte bancaire.

5. CONTRAINTE DE STYLE :
- N'utilise AUCUN emoji ni sticker.`;

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
