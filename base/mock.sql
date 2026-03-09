-- ============================================================
-- DONNÉES INITIALES — Templates de base prêts à utiliser
-- ============================================================

INSERT INTO templates (name, service, industry_type, description, config_json, version)
VALUES
(
    'GTM E-commerce Standard',
    'gtm',
    'ecommerce',
    'Container GTM avec GA4, suivi achats, panier, checkout et remarketing',
    '{
        "tags": [],
        "triggers": [],
        "variables": [],
        "type": "ecommerce_standard",
        "events": ["purchase", "add_to_cart", "begin_checkout", "view_item"]
    }',
    '1.0.0'
),
(
    'GTM Lead Gen Standard',
    'gtm',
    'lead_gen',
    'Container GTM avec GA4, suivi formulaires, clics téléphone et conversions',
    '{
        "tags": [],
        "triggers": [],
        "variables": [],
        "type": "lead_gen_standard",
        "events": ["generate_lead", "form_submit", "phone_click", "page_view"]
    }',
    '1.0.0'
),
(
    'GA4 E-commerce Config',
    'ga4',
    'ecommerce',
    'Propriété GA4 avec événements e-commerce standards et conversions',
    '{
        "events": ["purchase", "add_to_cart", "begin_checkout", "view_item", "view_item_list"],
        "conversions": ["purchase"],
        "custom_dimensions": []
    }',
    '1.0.0'
),
(
    'GA4 Lead Gen Config',
    'ga4',
    'lead_gen',
    'Propriété GA4 avec événements formulaires, appels et conversions lead',
    '{
        "events": ["generate_lead", "form_submit", "phone_click", "contact"],
        "conversions": ["generate_lead", "form_submit"],
        "custom_dimensions": []
    }',
    '1.0.0'
),
(
    'Google Ads E-commerce Conversions',
    'google_ads',
    'ecommerce',
    'Actions de conversion Ads pour e-commerce — achat et panier abandonné',
    '{
        "conversion_actions": [
            { "name": "Achat", "category": "PURCHASE", "counting_type": "ONE_PER_CLICK" },
            { "name": "Panier abandonné", "category": "ADD_TO_CART", "counting_type": "MANY_PER_CLICK" }
        ]
    }',
    '1.0.0'
),
(
    'Google Ads Lead Gen Conversions',
    'google_ads',
    'lead_gen',
    'Actions de conversion Ads pour lead gen — formulaire et appel',
    '{
        "conversion_actions": [
            { "name": "Formulaire soumis", "category": "SUBMIT_LEAD_FORM", "counting_type": "ONE_PER_CLICK" },
            { "name": "Appel téléphonique", "category": "PHONE_CALL_LEAD", "counting_type": "ONE_PER_CLICK" }
        ]
    }',
    '1.0.0'
);