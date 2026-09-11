import { databaseService } from './supabase.service.js';
import { aiService } from './ai.service.js';
import { whatsappService } from './whatsapp.service.js';
import { config } from '../config/env.js';

export interface WhatsAppTask {
  customerName: string;
  fromPhone: string;
  metaPhoneNumberId: string;
  userText: string;
  currentPmeConfig: any;
  liveStats: any;
}

class WhatsAppQueueService {
  private queue: WhatsAppTask[] = [];
  private isProcessing = false;

  /**
   * Enfile une tâche de traitement de message WhatsApp
   */
  enqueue(task: WhatsAppTask) {
    this.queue.push(task);
    console.log(`📥 [Queue WhatsApp] Tâche ajoutée (${this.queue.length} en attente)`);
    this.processQueue();
  }

  /**
   * Traite la file d'attente en tâche de fond
   */
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const task = this.queue.shift();

    if (!task) {
      this.isProcessing = false;
      return;
    }

    try {
      const { customerName, fromPhone, metaPhoneNumberId, userText, currentPmeConfig, liveStats } = task;

      // 1. Identification dynamique de la PME
      const pmeRecord = await databaseService.getPmeByPhoneNumberIdOrPhone(metaPhoneNumberId);

      const pmeContext = {
        name: pmeRecord?.pme?.name || currentPmeConfig.name,
        description: pmeRecord?.pme?.description || currentPmeConfig.description,
        tone: pmeRecord?.pme?.tone || currentPmeConfig.tone,
        welcomeMessage: pmeRecord?.pme?.welcome_message || currentPmeConfig.welcomeMessage,
        deliveryInfo: pmeRecord?.pme?.delivery_info || currentPmeConfig.deliveryInfo,
        catalogue: pmeRecord?.catalogue || currentPmeConfig.catalogue
      };

      const pmeId = pmeRecord?.pme?.id || 'mock-pme-123';
      const isAiActive = pmeRecord?.pme?.is_ai_active !== false;

      if (!isAiActive) {
        console.log(`🛑 L'IA est désactivée pour la PME "${pmeContext.name}". Tâche ignorée.`);
        this.isProcessing = false;
        this.processQueue();
        return;
      }

      // 2. Enregistrement / Récupération du client
      const customer = await databaseService.upsertCustomer(pmeId, fromPhone, customerName);

      if (customer?.is_human_takeover) {
        console.log(`👤 Mode Prise en Main Humaine actif pour ${fromPhone}.`);
        if (customer.id) {
          await databaseService.saveChatMessage(pmeId, customer.id, 'user', userText);
        }
        this.isProcessing = false;
        this.processQueue();
        return;
      }

      // 3. Récupération de l'historique
      const chatHistory = customer?.id
        ? await databaseService.getChatHistory(pmeId, customer.id, 8)
        : [];

      // 4. Enregistrement du message utilisateur
      if (customer?.id) {
        await databaseService.saveChatMessage(pmeId, customer.id, 'user', userText);
      }

      // 5. Génération de la réponse IA
      const aiResponse = await aiService.generateResponse(
        userText,
        chatHistory,
        pmeContext
      );

      // 6. Enregistrement de la réponse assistant
      if (customer?.id) {
        await databaseService.saveChatMessage(pmeId, customer.id, 'assistant', aiResponse);
      }

      // 7. Mise à jour des métriques
      if (liveStats) {
        liveStats.totalMessages += 1;
      }

      // 8. Envoi du message WhatsApp via Meta Cloud API
      await whatsappService.sendTextMessage(
        fromPhone,
        aiResponse,
        {
          phoneNumberId: pmeRecord?.pme?.meta_phone_number_id || metaPhoneNumberId || config.whatsapp.phoneNumberId,
          token: (pmeRecord?.pme?.meta_access_token && pmeRecord.pme.meta_access_token.startsWith('EAAapZBe5Q')) ? pmeRecord.pme.meta_access_token : config.whatsapp.token
        }
      );

      console.log(`⚡ [Queue Traitée] Réponse envoyée avec succès à ${fromPhone}`);

    } catch (error) {
      console.error('❌ Erreur lors du traitement asynchrone WhatsApp:', error);
    } finally {
      this.isProcessing = false;
      // Passer au message suivant dans la file d'attente
      setImmediate(() => this.processQueue());
    }
  }
}

export const whatsappQueueService = new WhatsAppQueueService();
