-- Base de données Assistant WhatsApp PME (Supabase PostgreSQL)

-- 1. Table des Utilisateurs / Propriétaires PME
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des PME / Commerçants
CREATE TABLE IF NOT EXISTS pmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    whatsapp_phone_number VARCHAR(50) UNIQUE NOT NULL,
    business_type VARCHAR(100),
    description TEXT,
    meta_phone_number_id VARCHAR(100),
    meta_access_token TEXT,
    assistant_name VARCHAR(100) DEFAULT 'Reflex AI',
    tone VARCHAR(100) DEFAULT 'Chaleureux & Commercial',
    welcome_message TEXT,
    delivery_info TEXT,
    is_ai_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table du Catalogue Produits
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pme_id UUID REFERENCES pmes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price_xof NUMERIC(12, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des Clients (Acheteurs WhatsApp)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_phone VARCHAR(50) NOT NULL,
    pme_id UUID REFERENCES pmes(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    delivery_address TEXT,
    is_human_takeover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(whatsapp_phone, pme_id)
);

-- 5. Table des Commandes
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    pme_id UUID REFERENCES pmes(id) ON DELETE CASCADE,
    total_amount_xof NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, IN_DELIVERY, COMPLETED, CANCELLED
    payment_reference VARCHAR(255),
    payment_method VARCHAR(50), -- FEDAPAY_MOMO, KKAPAY_MOMO, CASH
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table des Éléments de Commande
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price_xof NUMERIC(12, 2) NOT NULL
);

-- 7. Table de l'historique des discussions WhatsApp (pour le contexte LLM)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pme_id UUID REFERENCES pmes(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'user', 'assistant', ou 'human_agent'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
