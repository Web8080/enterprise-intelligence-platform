WITH raw_opportunities AS (
  SELECT
    OPPORTUNITY_ID AS opportunity_id,
    ACCOUNT_ID AS account_id,
    REP_ID AS rep_id,
    OPPORTUNITY_NAME AS opportunity_name,
    STAGE_NAME AS stage_name,
    REGION_NAME AS region_name,
    CAST(OPPORTUNITY_VALUE AS NUMBER(18,2)) AS opportunity_value,
    CAST(WIN_PROBABILITY AS NUMBER(5,2)) AS win_probability,
    TO_DATE(EXPECTED_CLOSE_DATE) AS expected_close_date,
    TO_DATE(CLOSED_WON_DATE) AS closed_won_date,
    STATUS AS status
  FROM {{ source('enterprise_intelligence_platform', 'sales_pipeline_raw') }}
)

SELECT *
FROM raw_opportunities
