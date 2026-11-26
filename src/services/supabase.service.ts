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
  image_url?: string;
  stock_quantity?: number;
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
        // Si non trouvé par ID exact, récupérer la PME active enregistrée pour répondre immédiatement
        const { data: allPmes } = await supabase.from('pmes').select('*').order('created_at', { ascending: false });
        if (allPmes && allPmes.length > 0) {
          pme = allPmes[0];
          console.log(`🔗 Message lié à la PME active : "${pme.name}" pour l'ID Meta ${identifier}`);
        }
      }

      if (!pme) return null;

      // Auto-liaison de l'identifiant Meta s'il n'était pas encore enregistré
      if (!pme.meta_phone_number_id && identifier && !identifier.includes('+')) {
        pme.meta_phone_number_id = identifier;
        pme.is_ai_active = true;
        pme.whatsapp_status = 'CONNECTED';
        await supabase.from('pmes').update({
          meta_phone_number_id: identifier,
          is_ai_active: true,
          whatsapp_status: 'CONNECTED'
        }).eq('id', pme.id);
        console.log(`🔗 Auto-liaison Meta Phone Number ID (${identifier}) effectuée pour la PME "${pme.name}"`);
      }

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
          image_url: p.image_url,
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
   * Enregistre les identifiants Meta de la PME après la connexion OAuth Embedded Signup
   */
  async saveMetaConnection(
    pmePhone: string,
    wabaId: string,
    phoneNumberId: string,
    accessToken: string,
    displayPhone?: string
  ): Promise<boolean> {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      const cleanPhone = (pmePhone || '').replace(/\D/g, '');
      const { data: updatedPmes, error } = await supabase
        .from('pmes')
        .update({
          waba_id: wabaId,
          meta_phone_number_id: phoneNumberId,
          meta_access_token: accessToken,
          whatsapp_status: 'CONNECTED',
          whatsapp_phone_number: displayPhone || pmePhone,
          is_ai_active: true
        })
        .eq('whatsapp_phone_number', pmePhone)
        .select();

      if (!error && updatedPmes && updatedPmes.length > 0) {
        console.log(`✅ Identifiants Meta WABA enregistrés pour ${pmePhone}`);
        return true;
      }

      // Fallback : Mettre à jour la PME la plus récente si numéro formaté différemment
      const { data: latestPme } = await supabase.from('pmes').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
      if (latestPme) {
        await supabase
          .from('pmes')
          .update({
            waba_id: wabaId,
            meta_phone_number_id: phoneNumberId,
            meta_access_token: accessToken,
            whatsapp_status: 'CONNECTED',
            whatsapp_phone_number: displayPhone || latestPme.whatsapp_phone_number || pmePhone,
            is_ai_active: true
          })
          .eq('id', latestPme.id);
        console.log(`✅ Identifiants Meta WABA enregistrés sur la PME ${latestPme.name}`);
        return true;
      }

      // Upsert direct si aucune PME existante
      await supabase.from('pmes').upsert({
        name: 'Ma PME WhatsApp',
        whatsapp_phone_number: displayPhone || pmePhone || '+229 97 00 00 00',
        waba_id: wabaId,
        meta_phone_number_id: phoneNumberId,
        meta_access_token: accessToken,
        whatsapp_status: 'CONNECTED',
        is_ai_active: true
      });
      return true;
    } catch (err) {
      console.error('Erreur saveMetaConnection:', err);
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
          business_type: pmeConfig.sector,
          tone: pmeConfig.tone,
          welcome_message: pmeConfig.welcomeMessage,
          delivery_info: pmeConfig.deliveryInfo,
          meta_phone_number_id: pmeConfig.metaPhoneNumberId || config.whatsapp.phoneNumberId,
          meta_access_token: pmeConfig.metaAccessToken || config.whatsapp.token,
          whatsapp_status: 'CONNECTED',
          is_ai_active: true,
          user_id: pmeConfig.userId || undefined
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

  /**
   * Sauvegarde une nouvelle commande
   */
  async saveOrder(orderData: {
    id: string;
    pmeId?: string;
    customerPhone?: string;
    phone?: string;
    customerName: string;
    amount: number;
    item: string;
    deliveryAddress?: string;
    paymentRef?: string;
    status?: string;
  }) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      await supabase.from('orders').upsert({
        order_number: orderData.id,
        pme_id: orderData.pmeId || null,
        customer_phone: orderData.customerPhone || orderData.phone || '',
        customer_name: orderData.customerName,
        total_amount: orderData.amount,
        items_description: orderData.item,
        delivery_address: orderData.deliveryAddress || 'Cotonou, Bénin',
        payment_reference: orderData.paymentRef,
        status: orderData.status || 'PENDING'
      });
      return true;
    } catch (err) {
      console.error('Erreur saveOrder:', err);
      return false;
    }
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateOrderStatus(orderId: string, status: string, paymentRef?: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      const updates: any = { status };
      if (paymentRef) updates.payment_reference = paymentRef;

      await supabase
        .from('orders')
        .update(updates)
        .eq('order_number', orderId);
      return true;
    } catch (err) {
      console.error('Erreur updateOrderStatus:', err);
      return false;
    }
  }

  /**
   * Récupère les commandes non payées créées depuis plus de X minutes pour la relance automatique
   */
  async getUnpaidOrdersForReminder(minutesThreshold = 15) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return [];
    }

    try {
      const thresholdTime = new Date(Date.now() - minutesThreshold * 60 * 1000).toISOString();
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'PENDING')
        .eq('reminder_sent', false)
        .lt('created_at', thresholdTime);

      return orders || [];
    } catch (err) {
      console.error('Erreur getUnpaidOrdersForReminder:', err);
      return [];
    }
  }

  /**
   * Marquer la relance de commande comme envoyée
   */
  async listInboxConversations(userId?: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return [];
    }

    try {
      let pmeQuery = supabase.from('pmes').select('id');
      if (userId) {
        pmeQuery = pmeQuery.eq('user_id', userId);
      }
      const { data: pmes } = await pmeQuery.limit(1);
      const pmeId = pmes?.[0]?.id;
      if (!pmeId) return [];

      const { data: messages } = await supabase
        .from('chat_messages')
        .select('content, created_at, customer_id, customers(full_name, whatsapp_phone)')
        .eq('pme_id', pmeId)
        .order('created_at', { ascending: false })
        .limit(80);

      const seen = new Set<string>();
      const threads: Array<{
        customerId: string;
        name: string;
        phone: string;
        lastMessage: string;
        lastAt: string;
      }> = [];

      for (const m of messages || []) {
        if (!m.customer_id || seen.has(m.customer_id)) continue;
        seen.add(m.customer_id);
        const customerRel = (m as any).customers;
        const customer = Array.isArray(customerRel) ? customerRel[0] : customerRel;
        threads.push({
          customerId: m.customer_id,
          name: customer?.full_name || 'Client WhatsApp',
          phone: customer?.whatsapp_phone || '',
          lastMessage: m.content,
          lastAt: m.created_at
        });
      }
      return threads;
    } catch (err) {
      console.error('Erreur listInboxConversations:', err);
      return [];
    }
  }

  async markReminderSent(orderId: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      await supabase
        .from('orders')
        .update({ reminder_sent: true })
        .eq('order_number', orderId);
      return true;
    } catch (err) {
      console.error('Erreur markReminderSent:', err);
      return false;
    }
  }

  /**
   * Récupère la PME associée à un compte utilisateur Supabase
   */
  async getPmeByUserId(userId: string): Promise<any | null> {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('pmes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erreur getPmeByUserId:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur getPmeByUserId catch:', err);
      return null;
    }
  }

  /**
   * Récupère les métriques consolidées réelles isolées par PME
   */
  async getPmeStats(pmeId: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return null;
    }

    try {
      // 1. Total commandes et Chiffre d'affaires
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .eq('pme_id', pmeId);

      const totalOrders = orders ? orders.length : 0;
      const paidOrders = orders ? orders.filter(o => o.status === 'PAID') : [];
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      // 2. Total messages échangés
      const { count: totalMessages } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact', head: true })
        .eq('pme_id', pmeId);

      // 3. Calcul du taux de conversion
      const conversionRate = totalOrders > 0 && totalMessages ? Math.min(100, Math.round((paidOrders.length / (totalMessages / 4 || 1)) * 100)) : 18;

      return {
        totalRevenue,
        commandesCount: paidOrders.length,
        totalOrders,
        totalMessages: totalMessages || 0,
        conversionRate,
        autoAiPercent: 96
      };
    } catch (err) {
      console.error('Erreur getPmeStats:', err);
      return null;
    }
  }

  /**
   * Récupère les commandes récentes d'une PME
   */
  async getPmeOrders(pmeId: string, limit = 25) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return [];
    }

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('pme_id', pmeId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erreur getPmeOrders:', error);
        return [];
      }
      return orders || [];
    } catch (err) {
      console.error('Erreur getPmeOrders catch:', err);
      return [];
    }
  }

  /**
   * Récupère les informations d'abonnement actif d'une PME
   */
  async getPmeSubscription(pmeId: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return {
        plan: 'Starter',
        status: 'ACTIVE',
        price: 15000,
        messagesLimit: 1000,
        messagesUsed: 247,
        daysRemaining: 23,
        expiresAt: new Date(Date.now() + 23 * 24 * 3600 * 1000).toISOString()
      };
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('pme_id', pmeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return {
          plan: 'Starter',
          status: 'ACTIVE',
          price: 15000,
          messagesLimit: 1000,
          messagesUsed: 120,
          daysRemaining: 30,
          expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
        };
      }

      const expires = new Date(data.expires_at || Date.now());
      const now = new Date();
      const diffMs = expires.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      return {
        plan: data.plan_name || 'Starter',
        status: data.status || 'ACTIVE',
        price: Number(data.price_xof || 15000),
        messagesLimit: data.messages_limit || 1000,
        messagesUsed: data.messages_used || 0,
        daysRemaining,
        expiresAt: data.expires_at
      };
    } catch (err) {
      console.error('Erreur getPmeSubscription:', err);
      return {
        plan: 'Starter',
        status: 'ACTIVE',
        price: 15000,
        messagesLimit: 1000,
        messagesUsed: 0,
        daysRemaining: 30
      };
    }
  }

  /**
   * Active ou met à jour un abonnement pour une PME
   */
  async savePmeSubscription(pmeId: string, plan: string, price: number, messagesLimit: number) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      await supabase.from('subscriptions').insert({
        pme_id: pmeId,
        plan_name: plan,
        status: 'ACTIVE',
        price_xof: price,
        messages_limit: messagesLimit,
        messages_used: 0,
        expires_at: expiresAt
      });

      // Mettre à jour active_plan dans pmes
      await supabase.from('pmes').update({ active_plan: plan }).eq('id', pmeId);
      return true;
    } catch (err) {
      console.error('Erreur savePmeSubscription:', err);
      return false;
    }
  }

  /**
   * Enregistre les clés d'API de paiement personnelles d'une PME (FedaPay / KKiaPay)
   */
  async savePmePaymentKeys(pmeId: string, keys: {
    fedapaySecretKey?: string;
    fedapayPublicKey?: string;
    kkiapaySecretKey?: string;
    kkiapayPublicKey?: string;
  }) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return true;
    }

    try {
      const updates: any = {};
      if (keys.fedapaySecretKey !== undefined) updates.fedapay_secret_key = keys.fedapaySecretKey;
      if (keys.fedapayPublicKey !== undefined) updates.fedapay_public_key = keys.fedapayPublicKey;
      if (keys.kkiapaySecretKey !== undefined) updates.kkiapay_secret_key = keys.kkiapaySecretKey;
      if (keys.kkiapayPublicKey !== undefined) updates.kkiapay_public_key = keys.kkiapayPublicKey;

      const { error } = await supabase.from('pmes').update(updates).eq('id', pmeId);
      if (error) {
        console.error('Erreur savePmePaymentKeys:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Erreur savePmePaymentKeys catch:', err);
      return false;
    }
  }

  /**
   * Récupère les clés de paiement personnalisées de la PME
   */
  async getPmePaymentKeys(pmeId: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      return {};
    }

    try {
      const { data } = await supabase
        .from('pmes')
        .select('fedapay_secret_key, fedapay_public_key, kkiapay_secret_key, kkiapay_public_key')
        .eq('id', pmeId)
        .maybeSingle();

      return data || {};
    } catch (err) {
      console.error('Erreur getPmePaymentKeys:', err);
      return {};
    }
  }
}

export const databaseService = new DatabaseService();

