import { databaseService } from './supabase.service.js';
import { aiService } from './ai.service.js';
import { whatsappService } from './whatsapp.service.js';

export interface WhatsAppTask {
  customerName: string;
  fromPhone: string;
  metaPhoneNumberId: string;
  userText: string;
  liveStats: any;
}

class WhatsAppQueueService {
  private queue: WhatsAppTask[] = [];
  private isProcessing = false;

  enqueue(task: WhatsAppTask) {
    this.queue.push(task);
    console.log(`📥 [Queue WhatsApp] Tâche ajoutée (${this.queue.length} en attente)`);
    void this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const task = this.queue.shift();

    if (!task) {
      this.isProcessing = false;
      return;
    }

    try {
      const { customerName, fromPhone, metaPhoneNumberId, userText, liveStats } = task;

      // Un événement Meta doit toujours contenir metadata.phone_number_id.
      // Ne jamais router un événement incomplet vers le compte global de Reflex.
      if (!metaPhoneNumberId) {
        console.warn(`⚠️ Événement WhatsApp ignoré : phone_number_id absent (${fromPhone}).`);
        return;
      }

      // Résolution stricte du tenant : le phone_number_id Meta identifie une seule PME.
      const pmeRecord = await databaseService.getPmeByPhoneNumberIdOrPhone(metaPhoneNumberId);
      if (!pmeRecord?.pme) {
        console.warn(`⚠️ Aucun tenant Reflex trouvé pour le phone_number_id ${metaPhoneNumberId}.`);
        return;
      }

      const pme = pmeRecord.pme;
      const pmeContext = {
        name: pme.name,
        description: pme.description,
        tone: pme.tone,
        welcomeMessage: pme.welcome_message,
        deliveryInfo: pme.delivery_info,
        catalogue: pmeRecord.catalogue,
      };

      if (pme.is_ai_active === false) {
        console.log(`🛑 IA désactivée pour la PME "${pme.name}".`);
        return;
      }

      if (!pme.meta_phone_number_id || !pme.meta_access_token) {
        console.error(`❌ Identifiants Meta incomplets pour la PME ${pme.id}.`);
        return;
      }

      const customer = await databaseService.upsertCustomer(pme.id, fromPhone, customerName);
      if (!customer) {
        console.error(`❌ Client impossible à enregistrer pour la PME ${pme.id}.`);
        return;
      }

      if (customer.is_human_takeover) {
        console.log(`👤 Prise en main humaine active pour ${fromPhone}.`);
        await databaseService.saveChatMessage(pme.id, customer.id, 'user', userText);
        return;
      }

      const chatHistory = await databaseService.getChatHistory(pme.id, customer.id, 8);
      await databaseService.saveChatMessage(pme.id, customer.id, 'user', userText);

      const aiResponse = await aiService.generateResponse(userText, chatHistory, pmeContext);
      await databaseService.saveChatMessage(pme.id, customer.id, 'assistant', aiResponse);

      if (liveStats) liveStats.totalMessages += 1;

      // Toujours répondre avec les identifiants de la PME ciblée, jamais ceux du SaaS.
      await whatsappService.sendTextMessage(fromPhone, aiResponse, {
        phoneNumberId: pme.meta_phone_number_id,
        token: pme.meta_access_token,
      });

      console.log(`⚡ [Queue Traitée] Réponse envoyée à ${fromPhone} pour la PME ${pme.id}`);
    } catch (error) {
      console.error('❌ Erreur lors du traitement asynchrone WhatsApp:', error);
    } finally {
      this.isProcessing = false;
      setImmediate(() => void this.processQueue());
    }
  }
}

export const whatsappQueueService = new WhatsAppQueueService();
