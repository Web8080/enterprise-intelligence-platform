WITH raw_properties AS (
  SELECT
    PROPERTY_ID AS property_id,
    ORGANISATION_ID AS organisation_id,
    PROPERTY_NAME AS property_name,
    PROPERTY_TYPE AS property_type,
    REGION AS region,
    PORTFOLIO_NAME AS portfolio_name,
    TO_DATE(ACQUISITION_DATE) AS acquisition_date,
    CAST(OCCUPANCY_RATE AS NUMBER(5,2)) AS occupancy_rate
  FROM {{ source('enterprise_intelligence_platform', 'property_raw') }}
)

SELECT *
FROM raw_properties
