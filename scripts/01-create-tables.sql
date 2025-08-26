-- Criação das tabelas para o sistema de diretório de barbearias

-- Tabela de barbearias
CREATE TABLE IF NOT EXISTS barbershops (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    instagram VARCHAR(100),
    website VARCHAR(255),
    price_range ENUM('low', 'medium', 'high') DEFAULT 'medium',
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    amenities JSON,
    images JSON,
    hours JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_neighborhood (neighborhood),
    INDEX idx_rating (rating),
    INDEX idx_verified (verified)
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY,
    barbershop_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL, -- em minutos
    category ENUM('corte', 'barba', 'combo', 'tratamento', 'outros') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE,
    INDEX idx_barbershop_id (barbershop_id),
    INDEX idx_category (category)
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    barbershop_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE,
    INDEX idx_barbershop_id (barbershop_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);
