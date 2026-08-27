import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

export const supabase = createClient(
  config.supabaseUrl || 'https://dummy.supabase.co',
  config.supabaseServiceKey || 'dummy-key'
);

export class DatabaseService {
  /**
   * Récupère les données de la PME et son catalogue
   */
  async getPmeCatalogue(pmePhone: string) {
    if (!config.supabaseUrl || config.supabaseUrl.includes('dummy')) {
      // Mock Data pour le développement local si Supabase n'est pas encore connecté
      return {
        name: 'Boutique Élégance Bénin',
        catalogue: [
          { name: 'Perruque Brésilienne 18 pouces', price: 45000, description: 'Cheveux 100% naturels lisses' },
          { name: 'Sac à main en cuir artisanal', price: 25000, description: 'Fabriqué à Cotonou' },
          { name: 'Ensemble Tissu WAX de luxe', price: 18000, description: 'Qualité supérieure 6 yards' }
        ]
      };
    }

    try {
      const { data: pme } = await supabase
        .from('pmes')
        .select('*')
        .eq('whatsapp_phone_number', pmePhone)
        .single();

      if (!pme) return null;

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('pme_id', pme.id)
        .eq('is_active', true);

      return {
        name: pme.name,
        catalogue: products || []
      };
    } catch (error) {
      console.error('Erreur Supabase:', error);
      return null;
    }
  }

  /**
   * Enregistre ou met à jour les données de la PME et son catalogue
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
          sector: pmeConfig.sector
        })
        .select()
        .single();

      if (pme && pmeConfig.catalogue && pmeConfig.catalogue.length > 0) {
        for (const item of pmeConfig.catalogue) {
          await supabase.from('products').upsert({
            pme_id: pme.id,
            name: item.name,
            price: item.price,
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
