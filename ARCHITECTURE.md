# 📐 Architecture Technique Reflex ⚡

## 1. Moteur de l'Application
- **Frontend** : Web Application (React / Next.js).
- **Backend** : Node.js (TypeScript) avec Webhooks Express.
- **Base de données** : Supabase PostgreSQL (`schema.sql`).
- **Moteur IA** : OpenAI GPT-4o-mini (Génération de réponses WhatsApp + Résumés PDF).
- **Paiement** : **Kkiapay** (Agrégateur unique pour Mobile Money MTN & Moov).
- **Messagerie** : Meta WhatsApp Cloud API.

---

## 2. Flux de Données & Génération de Résumé PDF

```
[ Client WhatsApp ] ──> [ Webhook Meta ] ──> [ Backend Reflex ]
                                                   │
                                                   ├──> 1. Appel LLM (GPT-4o-mini)
                                                   ├──> 2. Déclenchement Paiement Kkiapay
                                                   └──> 3. Génération du Résumé PDF & Conclusion
                                                                  │
                                                                  ▼
                                                      [ Dashboard Reflex PME ]
```
