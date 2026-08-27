# Reflex ⚡ - Assistant Commercial Intelligent WhatsApp pour PME

## 📌 1. Vision & Concept
**Reflex** est une solution d'automatisation intelligente sur WhatsApp conçue pour les PME.
Le parcours est fluide et épuré :
1. **Landing Page & Authentification** : Inscription simple et connexion via Google / Email.
2. **Formulaire d'Onboarding PME** : Configuration du numéro WhatsApp Business, du nom de l'entreprise, du catalogue produits et de la clé Kkiapay.
3. **Assistant WhatsApp IA** : L'IA gère l'inbox WhatsApp, répond aux clients, les guide jusqu'à la commande et encaisse via Kkiapay (Mobile Money MTN / Moov).
4. **Résumés PDF & Conclusions** : Pour chaque discussion client, l'IA génère automatiquement une fiche de résumé PDF lisible et téléchargeable avec la conclusion de la vente.

---

## 🏗️ 2. Parcours Utilisateur Reflex (User Flow)

```
[ Landing Page Reflex ] ───> [ Connexion Google / Email ]
                                        │
                                        ▼
                         [ Formulaire Onboarding PME ]
                         (Nom PME, WhatsApp, Catalogue, Clé Kkiapay)
                                        │
                                        ▼
                           [ Dashboard Central Reflex ]
     ┌──────────────────────────────────┼──────────────────────────────────┐
     ▼                                  ▼                                  ▼
[ Inbox WhatsApp Live ]      [ Résumés PDF & Conclusions ]    [ Suivi des Paiements Kkiapay ]
```

---

## 🛠️ 3. Architecture Technique

- **Frontend** : React / Next.js + CSS Modern Dark Glassmorphism.
- **Backend API** : Node.js (TypeScript) + Express.
- **Moteur IA** : OpenAI (GPT-4o-mini) pour la génération de réponses et résumés PDF.
- **Base de données** : Supabase PostgreSQL.
- **Agrégateur de Paiement** : **Kkiapay** (Unique agrégateur pour Mobile Money MTN, Moov et Cartes).
- **Intégration WhatsApp** : Meta WhatsApp Business Cloud API.
