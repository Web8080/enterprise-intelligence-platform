# Wireframe H: Integrations

```mermaid
flowchart TB
    A[Integrations Navigation] --> B[Connected Systems Summary]
    B --> C[Snowflake]
    B --> D[Yardi]
    B --> E[Salesforce]
    B --> F[Stripe]
    B --> G[Slack]
    B --> H[Power BI]
    C --> I[Manage Connection and Last Sync]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
```

## Notes

Each integration card shows category, connection status, last sync time, data scope and a connect or manage action. Salesforce supplies the sales opportunity pipeline that feeds `curated.sales_pipeline_fact`.
