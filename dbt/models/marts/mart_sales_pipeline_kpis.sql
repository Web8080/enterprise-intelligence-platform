SELECT
  p.region_name,
  p.stage_name,
  COUNT(*) AS deal_count,
  SUM(p.opportunity_value) AS pipeline_value,
  ROUND(AVG(p.win_probability), 2) AS avg_win_probability,
  MIN(p.expected_close_date) AS earliest_close_date,
  MAX(p.expected_close_date) AS latest_close_date
FROM {{ ref('stg_sales_pipeline') }} p
WHERE p.status = 'OPEN'
GROUP BY 1,2
ORDER BY pipeline_value DESC
