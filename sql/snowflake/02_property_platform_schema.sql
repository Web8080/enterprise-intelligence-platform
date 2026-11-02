USE DATABASE ENTERPRISE_INTELLIGENCE_PLATFORM;
USE SCHEMA CURATED;

CREATE OR REPLACE TABLE property_dim (
    property_id VARCHAR,
    organisation_id VARCHAR,
    property_name VARCHAR,
    property_type VARCHAR,
    region VARCHAR,
    portfolio_name VARCHAR,
    acquisition_date DATE,
    occupancy_rate NUMBER(5,2),
    PRIMARY KEY (property_id)
);

CREATE OR REPLACE TABLE tenant_dim (
    tenant_id VARCHAR,
    property_id VARCHAR,
    tenant_name VARCHAR,
    lease_start_date DATE,
    lease_end_date DATE,
    payment_risk_score NUMBER(5,2),
    PRIMARY KEY (tenant_id)
);

CREATE OR REPLACE TABLE payment_fact (
    payment_id VARCHAR,
    property_id VARCHAR,
    tenant_id VARCHAR,
    invoice_month DATE,
    rental_amount NUMBER(18,2),
    amount_paid NUMBER(18,2),
    arrears_amount NUMBER(18,2),
    payment_status VARCHAR,
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TABLE maintenance_fact (
    maintenance_id VARCHAR,
    property_id VARCHAR,
    maintenance_category VARCHAR,
    cost_amount NUMBER(18,2),
    work_order_status VARCHAR,
    requested_at TIMESTAMP_LTZ,
    completed_at TIMESTAMP_LTZ,
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TABLE occupancy_fact (
    property_id VARCHAR,
    snapshot_date DATE,
    occupied_units NUMBER,
    total_units NUMBER,
    occupancy_rate NUMBER(5,2),
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TABLE ai_interaction_log (
    interaction_id VARCHAR,
    user_id VARCHAR,
    organisation_id VARCHAR,
    question_text VARCHAR,
    generated_sql VARCHAR,
    confidence_score NUMBER(5,2),
    execution_status VARCHAR,
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW v_property_kpis AS
SELECT
    p.property_id,
    p.property_name,
    p.region,
    p.portfolio_name,
    p.occupancy_rate,
    SUM(COALESCE(pay.arrears_amount, 0)) AS total_arrears,
    SUM(COALESCE(pay.rental_amount, 0)) AS total_rent,
    AVG(COALESCE(pay.payment_status = 'OVERDUE', FALSE)) AS overdue_ratio
FROM property_dim p
LEFT JOIN payment_fact pay
  ON p.property_id = pay.property_id
GROUP BY 1,2,3,4,5;

CREATE OR REPLACE VIEW v_maintenance_summary AS
SELECT
    property_id,
    maintenance_category,
    SUM(cost_amount) AS total_cost,
    COUNT(*) AS work_order_count
FROM maintenance_fact
GROUP BY property_id, maintenance_category;
