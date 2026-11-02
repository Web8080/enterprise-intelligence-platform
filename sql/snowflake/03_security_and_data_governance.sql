USE DATABASE ENTERPRISE_INTELLIGENCE_PLATFORM;
USE SCHEMA SECURITY;

CREATE OR REPLACE TABLE org_users (
    user_id VARCHAR,
    organisation_id VARCHAR,
    role_name VARCHAR,
    region VARCHAR,
    is_admin BOOLEAN,
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TABLE access_policies (
    policy_id VARCHAR,
    policy_name VARCHAR,
    entity_name VARCHAR,
    allowed_role VARCHAR,
    row_filter_sql VARCHAR,
    masking_level VARCHAR,
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TABLE audit_events (
    event_id VARCHAR,
    user_id VARCHAR,
    organisation_id VARCHAR,
    event_type VARCHAR,
    resource_name VARCHAR,
    status VARCHAR,
    event_timestamp TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TAG IF NOT EXISTS enterprise_data_classification;
ALTER TAG enterprise_data_classification SET MASKING POLICY = NULL;

CREATE OR REPLACE MASKING POLICY eip_mask_financials AS (
    val NUMBER)
RETURNS NUMBER ->
    CASE
      WHEN CURRENT_ROLE() IN ('EIP_ADMIN', 'EIP_ANALYST', 'EIP_DATA_ENGINEER') THEN val
      ELSE 0
    END;

CREATE OR REPLACE ROW ACCESS POLICY eip_org_filter AS (organisation_id VARCHAR) RETURNS BOOLEAN ->
    CURRENT_ROLE() IN ('EIP_ADMIN') OR organisation_id = CURRENT_ORGANISATION();
