import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

export const supabase = createClient(
  config.supabaseUrl || 'https://dummy.supabase.co',
  config.supabaseServiceKey || 'dummy-key'
);

export interface PmeRecord {
  id: string;
  name: string;
  whatsapp_phone_number: string;
  business_type?: string;
  description?: string;
  waba_id?: string;
  meta_phone_number_id?: string;
  meta_access_token?: string;
  whatsapp_status?: 'DISCONNECTED' | 'CONNECTED' | 'PENDING';
  assistant_name?: string;
  tone?: string;
  welcome_message?: string;
  delivery_info?: string;
  is_ai_active?: boolean;
}

export interface ProductRecord {
  id?: string;
  pme_id?: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  is_active?: boolean;
}

export interface CustomerRecord {
  id: string;
  pme_id: string;
  whatsapp_phone: string;
  full_name?: string;
  delivery_address?: string;
  is_human_takeover?: boolean;
}

export class DatabaseService {
  /**
   * Récupère la PME par son Meta Phone Number ID ou son numéro WhatsApp
   */
  async getPmeByPhoneNumberIdOrPhone(identifier: string): Promise<{ pme: PmeRecord; catalogue: ProductRecord[] } | null> {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return {
        pme: {
          id: 'mock-pme-123',
          name: 'Boutique Élégance Bénin',
          whatsapp_phone_number: '+229 97 00 00 00',
          meta_phone_number_id: config.whatsapp.phoneNumberId,
          meta_access_token: config.whatsapp.token,
          tone: 'Chaleureux & Commercial',
          welcome_message: 'Bonjour ! Bienvenue chez Boutique Élégance Bénin.',
          delivery_info: 'Livraison express sous 24h à Cotonou.',
          is_ai_active: true
        },
        catalogue: [
          { name: 'Perruque Brésilienne 18 pouces', price: 45000, description: 'Cheveux 100% naturels lisses' },
          { name: 'Sac à main en cuir artisanal', price: 25000, description: 'Fabriqué à Cotonou' },
          { name: 'Ensemble Tissu WAX de luxe', price: 18000, description: 'Qualité supérieure 6 yards' }
        ]
      };
    }

    try {
      let { data: pme } = await supabase
        .from('pmes')
        .select('*')
        .eq('meta_phone_number_id', identifier)
        .maybeSingle();

      if (!pme) {
        const { data: fallbackPme } = await supabase
          .from('pmes')
          .select('*')
          .eq('whatsapp_phone_number', identifier)
          .maybeSingle();
        pme = fallbackPme;
      }

      if (!pme) return null;

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('pme_id', pme.id)
        .eq('is_active', true);

      return {
        pme,
        catalogue: (products || []).map(p => ({
          id: p.id,
          pme_id: p.pme_id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: Number(p.price_xof || p.price || 0),
          is_active: p.is_active
        }))
      };
    } catch (error) {
      console.error('Erreur getPmeByPhoneNumberIdOrPhone:', error);
      return null;
    }
  }

  /**
   * Enregistre ou récupère un client WhatsApp pour une PME donnée
   */
  async upsertCustomer(pmeId: string, whatsappPhone: string, fullName?: string): Promise<CustomerRecord | null> {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return {
        id: `cust-${whatsappPhone}`,
        pme_id: pmeId,
        whatsapp_phone: whatsappPhone,
        full_name: fullName || 'Client WhatsApp',
        is_human_takeover: false
      };
    }

    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .upsert(
          {
            pme_id: pmeId,
            whatsapp_phone: whatsappPhone,
            full_name: fullName || 'Client WhatsApp'
          },
          { onConflict: 'whatsapp_phone,pme_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Erreur upsertCustomer:', error);
        return null;
      }

      return customer;
    } catch (err) {
      console.error('Erreur Supabase upsertCustomer:', err);
      return null;
    }
  }

  /**
   * Récupère l'historique récent des conversations WhatsApp pour le contexte de l'IA
   */
  async getChatHistory(pmeId: string, customerId: string, limit = 10): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return [];
    }

    try {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('sender, content, created_at')
        .eq('pme_id', pmeId)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!messages) return [];

      return messages.reverse().map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }));
    } catch (err) {
      console.error('Erreur getChatHistory:', err);
      return [];
    }
  }

  /**
   * Enregistre un message dans la base de données
   */
  async saveChatMessage(pmeId: string, customerId: string, sender: 'user' | 'assistant' | 'human_agent', content: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      await supabase.from('chat_messages').insert({
        pme_id: pmeId,
        customer_id: customerId,
        sender,
        content
      });
      return true;
    } catch (err) {
      console.error('Erreur saveChatMessage:', err);
      return false;
    }
  }

  /**
   * Active ou désactive la prise en main humaine pour un client
   */
  async setHumanTakeover(customerId: string, isHumanTakeover: boolean) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      await supabase
        .from('customers')
        .update({ is_human_takeover: isHumanTakeover })
        .eq('id', customerId);
      return true;
    } catch (err) {
      console.error('Erreur setHumanTakeover:', err);
      return false;
    }
  }

  /**
   * Ancienne méthode conservée pour rétrocompatibilité onboarding
   */
  async savePmeCatalogue(pmePhone: string, pmeConfig: any) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      const { data: pme } = await supabase
        .from('pmes')
        .upsert({
          name: pmeConfig.name,
          whatsapp_phone_number: pmePhone,
          description: pmeConfig.description,
          sector: pmeConfig.sector,
          tone: pmeConfig.tone,
          welcome_message: pmeConfig.welcomeMessage,
          delivery_info: pmeConfig.deliveryInfo,
          meta_phone_number_id: pmeConfig.metaPhoneNumberId,
          meta_access_token: pmeConfig.metaAccessToken
        })
        .select()
        .single();

      if (pme && pmeConfig.catalogue && pmeConfig.catalogue.length > 0) {
        for (const item of pmeConfig.catalogue) {
          await supabase.from('products').upsert({
            pme_id: pme.id,
            name: item.name,
            price_xof: item.price,
            description: item.description,
            is_active: true
          });
        }
      }
      return true;
    } catch (error) {
      console.error('Erreur Supabase Save:', error);
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
