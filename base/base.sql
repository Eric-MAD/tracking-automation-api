-- ============================================================
--  SCHÉMA POSTGRESQL FINAL — SaaS Automatisation Google
--  Hébergement  : Supabase / Neon
--  Usage        : Compte agence unique (1 email maître)
--  Tables       : 7 tables (sans users)
--  Extensions   : pgcrypto, uuid-ossp
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. TABLE : agency_account
--    Compte Google maître — 1 seul enregistrement
--    Stocke les tokens OAuth chiffrés pour appeler les APIs
-- ============================================================
CREATE TABLE agency_account (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id           VARCHAR(255)    NOT NULL UNIQUE,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    access_token_enc    BYTEA,                     
    refresh_token_enc   BYTEA           NOT NULL,  
    token_expiry        TIMESTAMPTZ,              
    scopes              TEXT[]          NOT NULL DEFAULT '{}',
    mcc_id              VARCHAR(50),    
    gtm_account_id      VARCHAR(50),    
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  agency_account                    IS 'Compte Google unique de l agence — tokens OAuth chiffrés AES-256';
COMMENT ON COLUMN agency_account.refresh_token_enc  IS 'Refresh token chiffré. Clé AES stockée en variable d environnement UNIQUEMENT';
COMMENT ON COLUMN agency_account.scopes             IS 'Scopes OAuth accordés. Doit inclure GTM, GA4, Ads et Merchant scopes';
COMMENT ON COLUMN agency_account.mcc_id             IS 'ID du compte MCC Google Ads de l agence ex: 123-456-7890';


-- ============================================================
-- 2. TABLE : projects
--    Un client = un projet
--    Table centrale — tout le reste y est rattaché
-- ============================================================
CREATE TABLE projects (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(255)    NOT NULL,          
    client_company      VARCHAR(255),                       
    domain              VARCHAR(255)    NOT NULL,          
    industry            VARCHAR(50)     NOT NULL DEFAULT 'generic'
                                        CHECK (industry IN (
                                            'ecommerce',
                                            'lead_gen',
                                            'saas',
                                            'local',
                                            'generic'
                                        )),
    status              VARCHAR(50)     NOT NULL DEFAULT 'active'
                                        CHECK (status IN (
                                            'active',
                                            'paused',
                                            'archived'
                                        )),
    notes               TEXT,         
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  projects              IS 'Un projet = un client géré par l agence';
COMMENT ON COLUMN projects.domain       IS 'URL principale du site client — utilisée pour GTM et GA4';
COMMENT ON COLUMN projects.industry     IS 'Type d activité — détermine quel template appliquer par défaut';


-- ============================================================
-- 3. TABLE : client_google_accounts
--    Comptes Google du client par service
--    Un client peut avoir GTM + GA4 + Ads + Merchant
-- ============================================================
CREATE TABLE client_google_accounts (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id          UUID            NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    service             VARCHAR(50)     NOT NULL
                                        CHECK (service IN (
                                            'gtm',
                                            'ga4',
                                            'google_ads',
                                            'merchant_center'
                                        )),
    external_account_id VARCHAR(100)    NOT NULL,
    account_name        VARCHAR(255),
    access_level        VARCHAR(50)     NOT NULL DEFAULT 'editor'
                                        CHECK (access_level IN (
                                            'owner',
                                            'admin',
                                            'editor',
                                            'viewer'
                                        )),
    is_linked           BOOLEAN         NOT NULL DEFAULT FALSE,
    linked_at           TIMESTAMPTZ,
    extra_config        JSONB,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, service)
);

COMMENT ON TABLE  client_google_accounts                        IS 'IDs des comptes Google du client par service (GTM, GA4, Ads, Merchant)';
COMMENT ON COLUMN client_google_accounts.external_account_id    IS 'ID retourné par l API Google — GTM-XXX, G-XXX, etc.';
COMMENT ON COLUMN client_google_accounts.extra_config           IS 'Config JSONB spécifique au service — stream_id GA4, conversion_id Ads, etc.';


-- ============================================================
-- 4. TABLE : templates
--    Configurations JSON réutilisables
--    Le cœur du gain de temps — On configures une fois, on réutilises partout
-- ============================================================
CREATE TABLE templates (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),

    name                VARCHAR(255)    NOT NULL,  
    service             VARCHAR(50)     NOT NULL
                                        CHECK (service IN (
                                            'gtm',
                                            'ga4',
                                            'google_ads',
                                            'merchant_center'
                                        )),
    industry_type       VARCHAR(50)     NOT NULL
                                        CHECK (industry_type IN (
                                            'ecommerce',
                                            'lead_gen',
                                            'saas',
                                            'local',
                                            'generic'
                                        )),
    description         TEXT,
    config_json         JSONB           NOT NULL,
    version             VARCHAR(20)     NOT NULL DEFAULT '1.0.0',
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  templates                 IS 'Configurations JSON réutilisables — une config par service et par type d activité';
COMMENT ON COLUMN templates.config_json     IS 'GTM: container.json | GA4: events+conversions | Ads: conversion actions';
COMMENT ON COLUMN templates.version         IS 'Versioning pour suivre les évolutions de tes configurations types';


-- ============================================================
-- 5. TABLE : setups
--    Un déploiement complet pour un projet
--    Résumé global — les détails sont dans setup_steps
-- ============================================================
CREATE TABLE setups (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id          UUID            NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    template_id         UUID            REFERENCES templates(id) ON DELETE SET NULL,
    status              VARCHAR(50)     NOT NULL DEFAULT 'pending'
                                        CHECK (status IN (
                                            'pending',     
                                            'running',      
                                            'success',     
                                            'partial',      
                                            'failed',       
                                            'cancelled'     
                                        )),
    gtm_container_id    VARCHAR(100),   
    ga4_property_id     VARCHAR(100),   
    ga4_stream_id       VARCHAR(100),   
    ads_customer_id     VARCHAR(100),   
    merchant_id         VARCHAR(100),   
    error_summary       TEXT,          
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    duration_seconds    INTEGER,        
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  setups                IS 'Un setup = un déploiement automatisé complet pour un projet client';
COMMENT ON COLUMN setups.status         IS 'partial = certaines étapes OK d autres KO — permet relance ciblée des étapes en échec';
COMMENT ON COLUMN setups.template_id    IS 'Template utilisé pour ce déploiement — NULL si config manuelle';


-- ============================================================
-- 6. TABLE : setup_steps
--    Étapes individuelles de chaque setup
--    Permet de relancer uniquement les étapes en échec
-- ============================================================
CREATE TABLE setup_steps (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    setup_id            UUID            NOT NULL REFERENCES setups(id) ON DELETE CASCADE,
    step_name           VARCHAR(100)    NOT NULL,
    step_order          SMALLINT        NOT NULL,   
    service             VARCHAR(50)     NOT NULL
                                        CHECK (service IN (
                                            'gtm',
                                            'ga4',
                                            'google_ads',
                                            'merchant_center',
                                            'internal'
                                        )),
    status              VARCHAR(50)     NOT NULL DEFAULT 'pending'
                                        CHECK (status IN (
                                            'pending',     
                                            'running',     
                                            'success',     
                                            'failed',      
                                            'skipped',      
                                            'retrying'      
                                        )),
    input_payload       JSONB,          
    output_payload      JSONB,          
    error_message       TEXT,
    retry_count         SMALLINT        NOT NULL DEFAULT 0,
    max_retries         SMALLINT        NOT NULL DEFAULT 3,
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  setup_steps                   IS 'Étapes individuelles — permet relance ciblée sans tout refaire depuis le début';
COMMENT ON COLUMN setup_steps.input_payload     IS 'Payload envoyé à l API Google — utile pour reproduire l appel manuellement';
COMMENT ON COLUMN setup_steps.output_payload    IS 'Réponse brute de l API — contient les IDs créés et les erreurs détaillées';
COMMENT ON COLUMN setup_steps.step_order        IS 'Ordre d exécution strict — GTM avant GA4, GA4 avant Ads';


-- ============================================================
-- 7. TABLE : api_logs
--    Journal complet de tous les appels API Google
--    Indispensable pour le débogage et l'audit
-- ============================================================
CREATE TABLE api_logs (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    setup_step_id       UUID            REFERENCES setup_steps(id) ON DELETE SET NULL,
    setup_id            UUID            REFERENCES setups(id) ON DELETE CASCADE,
    project_id          UUID            REFERENCES projects(id) ON DELETE CASCADE,
    service             VARCHAR(50)     NOT NULL
                                        CHECK (service IN (
                                            'gtm',
                                            'ga4',
                                            'google_ads',
                                            'merchant_center',
                                            'oauth'         
                                        )),
    method              VARCHAR(10)     NOT NULL
                                        CHECK (method IN (
                                            'GET',
                                            'POST',
                                            'PUT',
                                            'PATCH',
                                            'DELETE'
                                        )),
    endpoint            TEXT            NOT NULL,   
    request_payload     JSONB,         
    response_payload    JSONB,          
    http_status_code    SMALLINT,
    response_time_ms    INTEGER,       
    is_error            BOOLEAN         NOT NULL DEFAULT FALSE,
    error_code          VARCHAR(100),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  api_logs                      IS 'Journal complet de tous les appels API — audit, debug et monitoring';
COMMENT ON COLUMN api_logs.http_status_code     IS '200=OK | 403=Accès refusé | 429=Quota dépassé | 500=Erreur Google';
COMMENT ON COLUMN api_logs.error_code           IS 'Code d erreur Google : PERMISSION_DENIED, QUOTA_EXCEEDED, INVALID_ARGUMENT...';


-- ============================================================
-- INDEX — Optimisation des requêtes fréquentes
-- ============================================================

-- Projects
CREATE INDEX idx_projects_status
    ON projects(status);

CREATE INDEX idx_projects_industry
    ON projects(industry);

-- Client Google Accounts
CREATE INDEX idx_client_accounts_project_id
    ON client_google_accounts(project_id);

CREATE INDEX idx_client_accounts_service
    ON client_google_accounts(service);

CREATE INDEX idx_client_accounts_is_linked
    ON client_google_accounts(is_linked);

-- Templates
CREATE INDEX idx_templates_service
    ON templates(service);

CREATE INDEX idx_templates_industry_type
    ON templates(industry_type);

CREATE INDEX idx_templates_is_active
    ON templates(is_active);

-- Setups
CREATE INDEX idx_setups_project_id
    ON setups(project_id);

CREATE INDEX idx_setups_status
    ON setups(status);

CREATE INDEX idx_setups_created_at
    ON setups(created_at DESC);

-- Setup Steps
CREATE INDEX idx_setup_steps_setup_id
    ON setup_steps(setup_id);

CREATE INDEX idx_setup_steps_status
    ON setup_steps(status);

CREATE INDEX idx_setup_steps_service
    ON setup_steps(service);

-- API Logs
CREATE INDEX idx_api_logs_setup_id
    ON api_logs(setup_id);

CREATE INDEX idx_api_logs_project_id
    ON api_logs(project_id);

CREATE INDEX idx_api_logs_setup_step_id
    ON api_logs(setup_step_id);

CREATE INDEX idx_api_logs_is_error
    ON api_logs(is_error);

CREATE INDEX idx_api_logs_service
    ON api_logs(service);

CREATE INDEX idx_api_logs_created_at
    ON api_logs(created_at DESC);


-- ============================================================
-- TRIGGERS — Mise à jour automatique de updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agency_account_updated_at
    BEFORE UPDATE ON agency_account
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_client_accounts_updated_at
    BEFORE UPDATE ON client_google_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();