SELECT
  p.property_id,
  p.property_name,
  p.portfolio_name,
  p.region,
  p.occupancy_rate,
  SUM(COALESCE(pay.arrears_amount, 0)) AS total_arrears,
  SUM(COALESCE(pay.rental_amount, 0)) AS total_rent_collected,
  MIN(pay.invoice_month) AS first_invoice_month,
  MAX(pay.invoice_month) AS latest_invoice_month,
  ROUND(AVG(CASE WHEN pay.payment_status = 'OVERDUE' THEN 1 ELSE 0 END), 4) AS overdue_ratio
FROM {{ ref('stg_properties') }} p
LEFT JOIN {{ source('enterprise_intelligence_platform', 'payment_fact') }} pay
  ON p.property_id = pay.property_id
GROUP BY 1,2,3,4,5
ORDER BY total_arrears DESC
