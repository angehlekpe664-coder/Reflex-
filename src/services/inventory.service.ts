import { supabase } from './supabase.service.js';
import { whatsappService } from './whatsapp.service.js';
import { config } from '../config/env.js';

export class InventoryService {
  /**
   * Décrémente la quantité en stock d'un produit lors d'un paiement confirmé
   */
  async decrementStock(pmeId: string, productName: string, quantity = 1): Promise<boolean> {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      console.log(`📦 [Stock Mock] Produit "${productName}" décrémenté de ${quantity} unité(s).`);
      return true;
    }

    try {
      // 1. Chercher le produit par son nom pour la PME
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('pme_id', pmeId)
        .ilike('name', `%${productName}%`)
        .maybeSingle();

      if (!product) {
        console.log(`⚠️ Produit "${productName}" non trouvé dans la base pour décrémentation.`);
        return false;
      }

      const currentStock = product.stock_quantity ?? 10;
      const newStock = Math.max(0, currentStock - quantity);

      // 2. Mettre à jour le stock
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) {
        console.error('Erreur mise à jour stock:', error);
        return false;
      }

      console.log(`✅ Stock mis à jour pour "${product.name}": ${currentStock} -> ${newStock}`);

      // 3. Alerte si le stock est bas (<= 3 unités)
      if (newStock <= 3) {
        await this.sendLowStockAlert(pmeId, product.name, newStock);
      }

      return true;
    } catch (err) {
      console.error('Erreur InventoryService decrementStock:', err);
      return false;
    }
  }

  /**
   * Alerte WhatsApp automatique envoyée au commerçant quand le stock est bas
   */
  private async sendLowStockAlert(pmeId: string, productName: string, remainingStock: number) {
    try {
      const { data: pme } = await supabase
        .from('pmes')
        .select('whatsapp_phone_number, meta_phone_number_id, meta_access_token')
        .eq('id', pmeId)
        .maybeSingle();

      if (pme?.whatsapp_phone_number) {
        const alertMsg = `⚠️ *ALERTE STOCK FAIBLE - REFLEX PME*\n\n` +
          `Le produit *${productName}* ne possède plus que *${remainingStock}* unité(s) en stock.\n\n` +
          `Pensez à réapprovisionner votre catalogue depuis le Dashboard Reflex.`;

        await whatsappService.sendTextMessage(
          pme.whatsapp_phone_number,
          alertMsg,
          {
            phoneNumberId: pme.meta_phone_number_id || config.whatsapp.phoneNumberId,
            token: pme.meta_access_token || config.whatsapp.token
          }
        );
        console.log(`🔔 Alerte de stock bas envoyée à la PME (${pme.whatsapp_phone_number})`);
      }
    } catch (err) {
      console.error('Erreur envoi alerte stock bas:', err);
    }
  }
}

export const inventoryService = new InventoryService();
